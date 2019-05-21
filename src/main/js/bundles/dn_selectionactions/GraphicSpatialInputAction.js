/*
 * Copyright (C) 2019 con terra GmbH (info@conterra.de)
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
import Graphic from "esri/Graphic";

export default class {

    activate() {
        let i18n = this._i18n.get().ui.graphic;
        this.id = "graphic";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-cursor";
        this.interactive = true;
    }

    deactivate() {
        this.closeWidget();
        this.removeGraphicFromView();
    }

    onSelectionExecuting() {
        this.removeGraphicFromView();
        this.oldGraphic = this.graphic;
    }

    trigger() {
        return new CancelablePromise((resolve, reject, oncancel) => {
            if (!this._mapWidgetModel) {
                reject("MapWidgetModel not available!");
            }
            let view = this._mapWidgetModel.get("view");
            let handle = view.on("click", (evt) => {
                handle.remove();
                // prevent popup
                evt.stopPropagation();
                view.hitTest(evt).then((response) => {
                    let results = response.results;
                    if (results.length) {
                        let graphic = results[0].graphic;
                        let geometry = graphic.geometry;
                        this.addGraphicToView(geometry);
                        resolve(geometry);
                    } else {
                        resolve(null);
                    }
                });
            });

            oncancel(() => {
                handle.remove();
                this.removeGraphicFromView();
                console.debug("GraphicSpatialInputAction was canceled...");
            });
        });
    }

    hitTest() {

    }

    addGraphicToView(geometry) {
        let view = this._mapWidgetModel.get("view");
        let symbol;
        switch (geometry.type) {
            case "point":
                symbol = {
                    type: "simple-marker",
                    color: [255, 0, 0, 0.25],
                    style: "solid",
                    outline: {
                        color: [255, 0, 0, 1],
                        width: "2px"
                    }
                };
                break;
            case "polyline":
                symbol = {
                    type: "simple-line",
                    color: [255, 0, 0, 1],
                    style: "solid"
                };
                break;
            case "polygon":
                symbol = {
                    type: "simple-fill",
                    color: [255, 0, 0, 0.25],
                    style: "solid",
                    outline: {
                        color: [255, 0, 0, 1],
                        width: "2px"
                    }
                };
                break;
        }
        let graphic = this.graphic = new Graphic({
            geometry: geometry,
            symbol: symbol
        });
        view.graphics.add(graphic);
    }

    removeGraphicFromView() {
        if (this.oldGraphic) {
            let view = this._mapWidgetModel.get("view");
            view.graphics.remove(this.oldGraphic);
        }
    }
}
