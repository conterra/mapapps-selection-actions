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
import AreaSelectSpatialInputWidget from "../widgets/AreaSelectSpatialInputWidget.vue";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import Binding from "apprt-binding/Binding";
import ServiceResolver from "apprt/ServiceResolver";
import{buffer} from "esri/geometry/geometryEngine";


export default class AreaSelectSpatialInputAction {

    #binding = undefined;
    #geometry = undefined;
    #highlighter = undefined;
    #serviceResolver = undefined;
    #serviceRegistration = undefined;
    #bundleContext = undefined;


    activate(componentContext) {
        const serviceResolver = this.#serviceResolver = new ServiceResolver();
        const bundleCtx = this.#bundleContext = componentContext.getBundleContext();
        serviceResolver.setBundleCtx(bundleCtx);
        const i18n = this.i18n = this._i18n.get().ui.area_select;
        this.id = "area_select";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-selection-freehand-polygon";
        this.interactive = true;
        this.#highlighter = this._highlighterFactory.forMapWidgetModel(this._mapWidgetModel);
    }

    deactivate() {
        this.#binding?.unbind();
        this.#binding = undefined;
        this.closeWidget();
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

            const model = this._areaSelectSpatialInputWidgetModel;
            const vm = new Vue(AreaSelectSpatialInputWidget);
            vm.buffer = model.buffer;
            vm.stepSize = model.stepSize;
            vm.unit = model.unit;
            vm.i18n = this.i18n;

            this.#binding = Binding.for(vm, model)
                .syncAllToLeft("storeData")
                .syncAll("selectedStoreId")
                .syncAllToRight("buffer")
                .enable()
                .syncToLeftNow();

            const widget = new VueDijit(vm);
            const serviceProperties = {
                "widgetRole": "areaSelectSpatialInputWidget"
            };
            const interfaces = ["dijit.Widget"];
            if (!this.#serviceRegistration) {
                this.#serviceRegistration = this.#bundleContext.registerService(interfaces, widget, serviceProperties);
            }

            const view = this._mapWidgetModel.get("view");
            const clickHandle = view.on("click", (evt) => {
                this.removeGraphicFromView();
                clickHandle.remove();
                // prevent popup
                evt.stopPropagation();
                const point = view.toMap({x: evt.x, y: evt.y});
                this.getFeature(point).then((featureGeometry) => {
                    if (!featureGeometry) {
                        resolve(null);
                    }
                    this.#geometry = buffer(featureGeometry, model.buffer, model.unit);
                    if (args.queryBuilderSelection) {
                        this.closeWidget();
                    } else {
                        this.addGraphicToView(featureGeometry);
                    }
                    resolve(featureGeometry);
                });
            });

            oncancel(() => {
                clickHandle.remove();
                this.removeGraphicFromView();
                this.closeWidget();
                console.debug("AreaSelectSpatialInputAction was canceled...");
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

    getFeature(point) {
        const model = this._areaSelectSpatialInputWidgetModel;
        const storeId = model.selectedStoreId;
        const store = this.getStore(storeId);
        return new Promise((resolve, reject) => {
            if (!store) {
                resolve(null);
            }
            store.query(
                {
                    geometry: {$intersects: point}
                },
                {
                    fields: {
                        geometry: 1
                    }
                }
            ).then((results) => {
                if (results.length) {
                    resolve(results[0].geometry);
                } else {
                    resolve(null);
                }
            });
        });
    }

    getStore(id) {
        return this.#serviceResolver.getService("ct.api.Store", "(id=" + id + ")");
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
