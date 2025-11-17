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
import Circle from "@arcgis/core/geometry/Circle";
import { difference } from "@arcgis/core/geometry/geometryEngine";
import CircleSpatialInputWidget from "../widgets/CircleSpatialInputWidget.vue";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import Binding from "apprt-binding/Binding";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import async from "apprt-core/async";

export default class CircleSpatialInputAction {

    #binding = undefined;
    #highlighter = undefined;
    #serviceRegistration = undefined;
    #bundleContext = undefined;
    #scaleWatcher = undefined;

    activate(componentContext) {
        this.#bundleContext = componentContext.getBundleContext();
        const i18n = this.i18n = this._i18n.get().ui.circle;
        this.id = "circle";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-selection-circle";
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

    enable() {
        const view = this._mapWidgetModel.get("view");
        const model = this._circleSpatialInputWidgetModel;
        if (!model.enableDonut) {
            model.innerRadius = 0;
        }

        const vm = this.vm = new Vue(CircleSpatialInputWidget);
        vm.i18n = this.i18n;
        vm.enableDonut = model.enableDonut;
        vm.minRadius = model.minRadius;
        vm.maxRadius = model.maxRadius;
        vm.innerRadius = model.innerRadius;
        vm.outerRadius = model.outerRadius;
        vm.stepSize = model.stepSize;
        vm.adjustStepSize = model.adjustStepSize;
        vm.unit = model.unit;

        vm.$on("adjustStepSize-changed", adjustStepSize => {
            if (adjustStepSize) {
                this.#scaleWatcher = this._getScaleWatcher(view, model, vm);
            } else {
                this.#scaleWatcher.remove();
                this.#scaleWatcher = undefined;
                vm.stepSize = model.stepSize;
            }
        });

        // handle inital activation adjustStepSize via config
        if (model.adjustStepSize) {
            this.#scaleWatcher = this._getScaleWatcher(view, model, vm);
        }

        this.#binding = Binding.for(vm, model)
            .syncAllToRight("innerRadius", "outerRadius", "adjustStepSize")
            .enable();

        const widget = new VueDijit(vm);
        const serviceProperties = {
            "widgetRole": "circleSpatialInputWidget"
        };
        const interfaces = ["dijit.Widget"];
        if (!this.#serviceRegistration) {
            this.#serviceRegistration = this.#bundleContext.registerService(interfaces, widget, serviceProperties);
        }
    }

    disable() {
        this.#scaleWatcher.remove();
        this.#scaleWatcher = undefined;
        this.closeWidget();
        this.removeGraphicFromView();
    }

    trigger(args) {
        return new CancelablePromise((resolve, reject, oncancel) => {
            if (!this._mapWidgetModel) {
                reject("MapWidgetModel not available!");
            }

            const view = this._mapWidgetModel.get("view");

            const clickHandle = view.on("click", (evt) => {
                this.removeGraphicFromView();
                clickHandle.remove();
                // prevent popup
                evt.stopPropagation();
                const point = view.toMap({ x: evt.x, y: evt.y });
                const circleGeometry = this.createDonutOrCircle(point);
                if (args?.queryBuilderSelection) {
                    this.closeWidget();
                } else {
                    this.addGraphicToView(circleGeometry);
                }
                resolve(circleGeometry);
            });

            oncancel(() => {
                clickHandle.remove();
                console.debug("CircleSpatialInputAction was canceled...");
                this.removeGraphicFromView();
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
        this.#highlighter.highlight(graphic);
    }

    removeGraphicFromView() {
        this.#highlighter.clear();
    }

    _getScaleWatcher(view, model, vm) {
        return reactiveUtils.watch(
            () => [view.scale], ([scale]) => {
                const adjustedStepSize = this._adjustStepSize(scale, model);
                vm.stepSize = adjustedStepSize.stepSize;
            },
            {
                initial: true
            }
        );
    }

    _adjustStepSize(scale, model) {
        return model.stepSizeRanges.find(range => range.scaleRange[0] <= scale && range.scaleRange[1] >= scale);
    }
}
