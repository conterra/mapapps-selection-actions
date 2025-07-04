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
import Circle from "esri/geometry/Circle";
import * as geometryEngine from "esri/geometry/geometryEngine";

export default class MultiPointSpatialInputAction {

    #geometry = undefined;
    #highlighter = undefined;
    #clickHandle = undefined;
    #doubleClickHandle = undefined;

    activate() {
        const i18n = this.i18n = this._i18n.get().ui.multipoint;
        this.id = "multipoint";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-location-marker";
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

    trigger() {
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

                const clickedPoint = view.toMap({x: evt.x, y: evt.y});
                const pointGeometry = this.createGeometryWithTolerance(clickedPoint, view);

                if (this.#geometry) {
                    this.#geometry = geometryEngine.union([this.#geometry, pointGeometry]);
                } else {
                    this.#geometry = pointGeometry;
                }

                this.removeGraphicFromView();
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

    createGeometryWithTolerance(clickedPoint, view) {
        const props = this._properties;
        const spatialRef = clickedPoint.spatialReference;

        if (!props.clickTolerance || props.clickTolerance === 0) {
            return clickedPoint;
        } else {
            const toleranceMapUnits = this.convertClickToleranceToMapUnits(props.clickTolerance, view);

            return new Circle({
                center: clickedPoint,
                radius: toleranceMapUnits,
                geodesic: (spatialRef.wkid === 3857
                    || spatialRef.wkid === 4326
                    || spatialRef.latestWkid === 3857
                    || spatialRef.latestWkid === 4326)
            });
        }
    }

    convertClickToleranceToMapUnits(clickTolerance, view) {
        const pixelWidth = view.width;
        const mapUnitWidth = view.extent.width;
        return mapUnitWidth / pixelWidth * (clickTolerance);
    }

    addGraphicToView(geometry) {
        this.removeGraphicFromView();
        const symbol = {
            type: "simple-fill",
            color: [255, 0, 0, 0.25],
            style: "solid",
            outline: {
                color: [255, 0, 0, 1],
                width: "2px"
            }
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
