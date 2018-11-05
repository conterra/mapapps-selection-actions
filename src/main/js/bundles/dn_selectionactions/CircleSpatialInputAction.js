/*
 * Copyright (C) 2018 con terra GmbH (info@conterra.de)
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
import Polygon from "esri/geometry/Polygon";
import Circle from "esri/geometry/Circle";
import CircleSpatialInputWidget from "./CircleSpatialInputWidget.vue";
import Vue from "apprt-vue/Vue";
import VueDijit from "apprt-vue/VueDijit";
import Binding from "apprt-binding/Binding";

export default class CircleSpatialInputAction {

    activate(componentContext) {
        this._bundleContext = componentContext.getBundleContext();
        let i18n = this.i18n = this._i18n.get().ui.circle;
        this.id = "circle";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-selection-circle";
        this.interactive = true;
    }

    deactivate() {
        this.closeWidget();
    }

    onSelectionExecuting() {
        this.removeGraphicFromView();
        //this.closeWidget();
        this.oldGraphic = this.graphic;
    }

    trigger(opts) {
        return new CancelablePromise((resolve, reject, oncancel) => {
            if (!this._mapWidgetModel) {
                reject("MapWidgetModel not available!");
            }
            let drawing = this._drawing;
            drawing.mode = "point";
            drawing.active = true;

            let model = this._circleSpatialInputWidgetModel;
            const vm = new Vue(CircleSpatialInputWidget);
            vm.i18n = this.i18n;
            vm.minRadius = model.minRadius;
            vm.maxRadius = model.maxRadius;
            vm.innerRadius = model.innerRadius;
            vm.outerRadius = model.outerRadius;
            vm.stepSize = model.stepSize;

            Binding
                .create()
                .bindTo(vm, model)
                .syncAll("innerRadius", "outerRadius")
                .enable();

            let widget = new VueDijit(vm);
            let serviceProperties = {
                "widgetRole": "circleSpatialInputWidget"
            };
            let interfaces = ["dijit.Widget"];
            if (!this._serviceregistration) {
                this._serviceregistration = this._bundleContext.registerService(interfaces, widget, serviceProperties);
            }

            let handle = drawing.watch("graphic", evt => {
                handle.remove();
                drawing.active = false;
                let point = evt.value.geometry;
                let innerCircle = CircleSpatialInputAction.createCircle(point, model.innerRadius);
                let outerCircle = CircleSpatialInputAction.createCircle(point, model.outerRadius);
                let circleGeometry = new Polygon({
                    spatialReference: point.spatialReference
                });
                circleGeometry.addRing(innerCircle.rings[0]);
                circleGeometry.addRing(outerCircle.rings[0]);

                this.addGraphicToView(circleGeometry);
                resolve(circleGeometry);
            });
            oncancel(() => {
                handle.remove();
                drawing.active = false;
                this.removeGraphicFromView();
                this.closeWidget();
                console.debug("CircleSpatialInputAction was canceled...");
            });
        });
    }

    closeWidget() {
        let registration = this._serviceregistration;

        // clear the reference
        this._serviceregistration = null;

        if (registration) {
            // call unregister
            registration.unregister();
        }
    }

    static createCircle(center, radius) {
        let geodesic = false;
        if (center.spatialReference.wkid === 3857 || center.spatialReference.wkid === 4326 || center.spatialReference.latestWkid === 3857 || center.spatialReference.latestWkid === 4326) {
            geodesic = true;
        }

        return new Circle({
            geodesic: geodesic,
            center: center,
            radius: radius,
            radiusUnit: "meters"
        });
    };

    addGraphicToView(circle) {
        let view = this._mapWidgetModel.get("view");
        let symbol = {
            type: "simple-fill",
            color: [255, 0, 0, 0.25],
            style: "solid",
            outline: {
                color: [255, 0, 0, 1],
                width: "2px"
            }
        };
        let graphic = this.graphic = new Graphic({
            geometry: circle,
            symbol: symbol
        });
        view.graphics.add(graphic);
    };

    removeGraphicFromView() {
        if (this.oldGraphic) {
            let view = this._mapWidgetModel.get("view");
            view.graphics.remove(this.oldGraphic);
        }
    }
}
