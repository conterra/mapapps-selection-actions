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
import Circle from "esri/geometry/Circle";
import {difference} from "esri/geometry/geometryEngine"
import CircleSpatialInputWidget from "../widgets/CircleSpatialInputWidget.vue";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import Binding from "apprt-binding/Binding";

const _geometry = Symbol("_geometry");
const _highlighter = Symbol("_highlight");
const _serviceregistration = Symbol("_serviceregistration");
const _bundleContext = Symbol("_bundleContext");

export default class CircleSpatialInputAction {

    #binding = undefined;

    activate(componentContext) {
        this[_bundleContext] = componentContext.getBundleContext();
        const i18n = this.i18n = this._i18n.get().ui.circle;
        this.id = "circle";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-selection-circle";
        this.interactive = true;
        this[_highlighter] = this._highlighterFactory.forMapWidgetModel(this._mapWidgetModel);
    }

    deactivate() {
        this.#binding?.unbind();
        this.#binding = undefined;
        this.closeWidget();
        this.removeGraphicFromView();
        this[_highlighter]?.destroy();
    }

    trigger(args) {
        return new CancelablePromise((resolve, reject, oncancel) => {
            if (!this._mapWidgetModel) {
                reject("MapWidgetModel not available!");
            }
            if (this[_geometry]) {
                this.addGraphicToView(this[_geometry]);
            }

            const model = this._circleSpatialInputWidgetModel;
            if (!model.enableDonut) {
                model.innerRadius = 0;
            }

            const vm = new Vue(CircleSpatialInputWidget);
            vm.i18n = this.i18n;
            vm.enableDonut = model.enableDonut;
            vm.minRadius = model.minRadius;
            vm.maxRadius = model.maxRadius;
            vm.innerRadius = model.innerRadius;
            vm.outerRadius = model.outerRadius;
            vm.stepSize = model.stepSize;
            vm.unit = model.unit;

            this.#binding = Binding.for(vm, model)
                .syncAllToRight("innerRadius", "outerRadius")
                .enable();

            const widget = new VueDijit(vm);
            const serviceProperties = {
                "widgetRole": "circleSpatialInputWidget"
            };
            const interfaces = ["dijit.Widget"];
            if (!this[_serviceregistration]) {
                this[_serviceregistration] = this[_bundleContext].registerService(interfaces, widget, serviceProperties);
            }

            const view = this._mapWidgetModel.get("view");
            const clickHandle = view.on("click", (evt) => {
                this.removeGraphicFromView();
                clickHandle.remove();
                // prevent popup
                evt.stopPropagation();
                const point = view.toMap({x: evt.x, y: evt.y});
                const circleGeometry = this[_geometry] = this.createDonutOrCircle(point);
                if (args.queryBuilderSelection) {
                    this.closeWidget();
                } else {
                    this.addGraphicToView(circleGeometry);
                }
                resolve(circleGeometry);
            });

            oncancel(() => {
                clickHandle.remove();
                this.removeGraphicFromView();
                this.closeWidget();
                console.debug("CircleSpatialInputAction was canceled...");
            });
        });
    }

    closeWidget() {
        const registration = this[_serviceregistration];

        // clear the reference
        this[_serviceregistration] = null;

        if (registration) {
            // call unregister
            registration.unregister();
        }
    }

    createDonutOrCircle(point) {
        const model = this._circleSpatialInputWidgetModel;
        let circleGeometry = this.createCircle(point, model.outerRadius);
        if (model.innerRadius > 0) {
            const innerCircle = this.createCircle(point, model.innerRadius);
            circleGeometry = difference(circleGeometry, innerCircle);
        }
        return circleGeometry;
    }

    createCircle(center, radius) {
        const model = this._circleSpatialInputWidgetModel;
        const unit = model.unit;
        let geodesic = false;
        if (center.spatialReference.wkid === 3857
            || center.spatialReference.wkid === 4326
            || center.spatialReference.latestWkid === 3857
            || center.spatialReference.latestWkid === 4326) {
            geodesic = true;
        }

        return new Circle({
            geodesic: geodesic,
            center: center,
            radius: radius,
            radiusUnit: unit
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
        this[_highlighter].highlight(graphic);
    }

    removeGraphicFromView() {
        this[_highlighter].clear();
    }
}
