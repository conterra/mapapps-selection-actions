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
import Observers from "apprt-core/Observers";

export default class {

    activate() {
        let i18n = this._i18n.get().ui.full_extent;
        this.id = "full_extent";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-globe";
        this.interactive = true;
    }

    trigger() {
        return new CancelablePromise((resolve, reject, oncancel) => {
            let model = this._mapWidgetModel;
            let basemapModel = this._basemapModel;
            if (!model) {
                reject("MapWidgetModel not available!");
            }
            if (!basemapModel) {
                reject("BasemapModel not available!");
            }

            const observers = Observers();

            function connectToView(view) {
                let group = observers.group("view");
                group.clean();
                if (!view) {
                    return;
                }
                group.add(view.on("click", (evt) => {
                    // prevent popup
                    evt.stopPropagation();
                    observers.destroy();
                    let selectedBasemap = basemapModel.selected.basemap;
                    let baseLayers = selectedBasemap.baseLayers;
                    let firstBasemapLayer = baseLayers.getItemAt(0);
                    resolve(firstBasemapLayer.fullExtent);
                }));
            }

            connectToView(model.view);
            observers.add(model.watch("view", ({value}) => {
                connectToView(value);
            }));
            oncancel(() => {
                console.debug("FullExtentSpatialInputAction was canceled...");
                observers.destroy();
            });
        });
    }
}
