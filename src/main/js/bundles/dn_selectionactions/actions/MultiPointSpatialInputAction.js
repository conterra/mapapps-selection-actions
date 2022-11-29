/*
 * Copyright (C) 2022 con terra GmbH (info@conterra.de)
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
import Point from "esri/geometry/Point";
import {difference} from "esri/geometry/geometryEngine";

export default class MultiPointSpatialInputAction {

    #geometry = undefined;
    #highlighter = undefined;

    activate() {
        const i18n = this.i18n = this._i18n.get().ui.multipoint;
        this.id = "multipoint";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-more-horizontal";
        this.interactive = true;
        this.#highlighter = this._highlighterFactory.forMapWidgetModel(this._mapWidgetModel);
    }

    deactivate() {
        this.removeGraphicFromView();
        this.#highlighter?.destroy();
    }

    trigger(args) {
        return new CancelablePromise((resolve, reject, oncancel) => {
            if (!this._mapWidgetModel) {
                reject("MapWidgetModel not available!");
            }
            if (this.#geometry) {
                this.addGraphicToView(this.#geometry);
            }

            const view = this._mapWidgetModel.get("view");
            const clickHandle = view.on("click", (evt) => {
                this.removeGraphicFromView();
                clickHandle.remove();
                // prevent popup
                evt.stopPropagation();
                const point = view.toMap({x: evt.x, y: evt.y});
                const pointGeometry = this.#geometry = this.createPoint(point);
                this.addGraphicToView(pointGeometry);
                resolve(pointGeometry);
            });

            oncancel(() => {
                clickHandle.remove();
                this.removeGraphicFromView();
                console.debug("MultiPointSpatialInputAction was canceled...");
            });
        });
    }

    createPoint(center) {
        let geodesic = false;
        if (center.spatialReference.wkid === 3857
            || center.spatialReference.wkid === 4326
            || center.spatialReference.latestWkid === 3857
            || center.spatialReference.latestWkid === 4326) {
            geodesic = true;
        }

        return new Point({
            geodesic: geodesic,
            center: center
        });
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
