/*
 * Copyright (C) 2023 con terra GmbH (info@conterra.de)
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
import GraphicSpatialInputWidget from "../widgets/GraphicSpatialInputWidget.vue";
import async from "apprt-core/async";
import { buffer } from "esri/geometry/geometryEngine";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import Binding from "apprt-binding/Binding";


export default class {
    #serviceRegistration = undefined;
    #bundleContext = undefined;
    #moveHandle = undefined;
    #highlighter = undefined;
    #binding = undefined;

    activate(componentContext) {
        this.#bundleContext = componentContext.getBundleContext();
        const i18n = this.i18n = this._i18n.get().ui.graphic;
        this.id = "graphic";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-cursor";
        this.interactive = true;
        this.#highlighter = this._highlighterFactory.forMapWidgetModel(this._mapWidgetModel);
    }

    deactivate() {
        this.removeGraphicFromView();
        this.#binding?.unbind();
        this.#binding = undefined;
        this.closeWidget();
    }

    onSelectionExecuting() {
        if (this.#moveHandle) {
            this.#moveHandle.remove();
        }
    }

    trigger() {
        return new CancelablePromise((resolve, reject, oncancel) => {
            if (!this._mapWidgetModel) {
                reject("MapWidgetModel not available!");
            }
            const model = this._graphicSpatialInputWidgetModel;
            const view = this._mapWidgetModel.get("view");

            const vm = new Vue(GraphicSpatialInputWidget);
            vm.i18n = this.i18n;
            vm.buffer = model.buffer;
            vm.minBuffer = model.minBuffer;
            vm.maxBuffer = model.maxBuffer;
            vm.stepSize = model.stepSize;
            vm.unit = model.unit;

            this.#binding = Binding.for(vm, model)
                .syncAllToRight("buffer")
                .enable()
                .syncToLeftNow();

            const widget = new VueDijit(vm);
            const serviceProperties = {
                "widgetRole": "graphicSpatialInputWidget"
            };
            const interfaces = ["dijit.Widget"];
            if (!this.#serviceRegistration) {
                this.#serviceRegistration = this.#bundleContext.registerService(interfaces, widget, serviceProperties);
            }

            this.#moveHandle = view.on("pointer-move", (evt) => {
                // prevent popup
                evt.stopPropagation();
                clearTimeout(this.moveTimeout);
                view.hitTest(evt).then((response) => {
                    const results = response.results;
                    if (results.length) {
                        const graphic = results[0].graphic;
                        const geometry = graphic.geometry;
                        if (geometry) {
                            const geometry = graphic.geometry;
                            this.#lastGeometry = geometry;
                            this.addGraphicToView(geometry);
                        }
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
                        let geometry = graphic.geometry;
                        geometry = buffer(geometry, model.buffer, model.unit);
                        this.#moveHandle.remove();
                        this.#moveHandle = null;
                        resolve(geometry);
                    } else {
                        resolve(null);
                    }
                });
            });

            oncancel(() => {
                this.#moveHandle.remove();
                this.#moveHandle = null;
                this.#bufferWatcher.remove();
                clickHandle.remove();
                this.closeWidget();
                console.debug("GraphicSpatialInputAction was canceled...");
                async(() => {
                    this.removeGraphicFromView();
                }, 500);
            });
        });
    }
    closeWidget() {
        const registration = this.#serviceRegistration;

        // clear the reference
        this.#serviceRegistration = null;

        if (registration) {
            // call unregister
            registration.unregister();
        }
    }
    addGraphicToView(geometry) {
        this.removeGraphicFromView();
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
