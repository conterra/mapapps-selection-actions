/*
 * Copyright (C) 2025 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import CancelablePromise from "apprt-core/CancelablePromise";
import Polyline from "esri/geometry/Polyline";

export default class PolylineSpatialInputAction {

    #geometry = undefined;
    #highlighter = undefined;
    #clickHandle = undefined;
    #doubleClickHandle = undefined;

    activate() {
        const i18n = this.i18n = this._i18n.get().ui.polyline;
        this.id = "polyline";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-polyline";
        this.interactive = true;
        this.#highlighter = this._highlighterFactory.forMapWidgetModel(this._mapWidgetModel);
    }

    deactivate() {
        this.#clickHandle.remove();
        this.#doubleClickHandle.remove();
        this.#geometry = undefined;
        this.removeGraphicFromView();
        this.#highlighter?.destroy();
    }

    trigger(args) {
        return new CancelablePromise((resolve, reject, oncancel) => {
            if (!this._mapWidgetModel) {
                reject("MapWidgetModel not available!");
            }
            const view = this._mapWidgetModel.get("view");

            this.#doubleClickHandle = view.on("double-click", (evt) => {
                evt.stopPropagation();
                resolve(this.#geometry);

                this.#clickHandle.remove();
                this.#doubleClickHandle.remove();
                this.#geometry = undefined;
                this.removeGraphicFromView();
            });

            this.#clickHandle = view.on("click", (evt) => {
                evt.stopPropagation();

                const clickedPoint = view.toMap({ x: evt.x, y: evt.y });

                if (!this.#geometry) {
                    this.#geometry = this.createGeometry(clickedPoint);
                } else {
                    this.#geometry = this.addPointToPolyline(this.#geometry, clickedPoint);
                }

                this.addGraphicToView(this.#geometry);
            });

            oncancel(() => {
                this.#clickHandle.remove();
                this.#doubleClickHandle.remove();
                this.#highlighter.clear();
                console.debug("MultiPointSpatialInputAction was canceled...");
            });
        });
    }

    createGeometry(clickedPoint) {
        const spatialRef = clickedPoint.spatialReference;
        return new Polyline({
            paths: [
                [
                    [clickedPoint.x, clickedPoint.y]
                ]
            ],
            spatialReference: spatialRef
        });
    }


    addPointToPolyline(polyline, point) {
        const paths = polyline.paths;
        paths[0].push([point.x, point.y]);

        return new Polyline({
            paths: paths,
            spatialReference: polyline.spatialReference
        });
    }

    convertClickToleranceToMapUnits(clickTolerance, view) {
        const pixelWidth = view.width;
        const mapUnitWidth = view.extent.width;
        return mapUnitWidth / pixelWidth * (clickTolerance);
    }

    addGraphicToView(geometry) {
        this.removeGraphicFromView();
        const symbol = {
            type: "simple-line",
            color: [255, 0, 0, 1],
            style: "solid",
            width: "2px"
        };
        const graphic = {
            geometry: geometry,
            symbol: symbol
        };
        this.#highlighter.highlight(graphic);
    }

    removeGraphicFromView() {
        this.#highlighter.clear();
    }
}
