/*
 * Copyright (C) 2020 con terra GmbH (info@conterra.de)
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

export default class {

    #moveHandle = undefined;
    #highlighter = undefined;

    activate() {
        const i18n = this._i18n.get().ui.graphic;
        this.id = "graphic";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-cursor";
        this.interactive = true;
        this.#highlighter = this._highlighterFactory.forMapWidgetModel(this._mapWidgetModel);
    }

    deactivate() {
        this.removeGraphicFromView();
    }

    onSelectionExecuting() {
        if (this.#moveHandle) {
            this.#moveHandle.remove();
        }
    }

    trigger(args) {
        return new CancelablePromise((resolve, reject, oncancel) => {
            if (!this._mapWidgetModel) {
                reject("MapWidgetModel not available!");
            }
            const view = this._mapWidgetModel.get("view");
            this.#moveHandle = view.on("pointer-move", (evt) => {
                // prevent popup
                evt.stopPropagation();
                view.hitTest(evt).then((response) => {
                    const results = response.results;
                    if (results.length) {
                        const graphic = results[0].graphic;
                        const geometry = graphic.geometry;
                        this.addGraphicToView(geometry);
                    }
                });
            });
            const clickHandle = view.on("click", (evt) => {
                this.removeGraphicFromView();
                clickHandle.remove();
                // prevent popup
                evt.stopPropagation();
                view.hitTest(evt).then((response) => {
                    const results = response.results;
                    if (results.length) {
                        const graphic = results[0].graphic;
                        const geometry = graphic.geometry;
                        resolve(geometry);
                    } else {
                        resolve(null);
                    }
                });
            });

            oncancel(() => {
                this.#moveHandle.remove();
                clickHandle.remove();
                this.removeGraphicFromView();
                console.debug("GraphicSpatialInputAction was canceled...");
            });
        });
    }

    addGraphicToView(geometry) {
        this.removeGraphicFromView();
        const view = this._mapWidgetModel.get("view");
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
