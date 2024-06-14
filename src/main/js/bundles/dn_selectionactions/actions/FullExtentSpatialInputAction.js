/*
 * Copyright (C) 2024 con terra GmbH (info@conterra.de)
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
import when from "apprt-core/when";
import Extent from "esri/geometry/Extent";

export default class {

    activate() {
        const i18n = this._i18n.get().ui.full_extent;
        this.id = "full_extent";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-globe";
        this.interactive = true;
    }

    trigger() {
        return new CancelablePromise((resolve, reject, oncancel) => {
            const that = this;
            const model = that._mapWidgetModel;
            if (!model) {
                reject("MapWidgetModel not available!");
            }

            const observers = Observers();

            function connectToView(view) {
                const group = observers.group("view");
                group.clean();
                if (!view) {
                    return;
                }
                group.add(view.on("click", (evt) => {
                    // prevent popup
                    evt.stopPropagation();

                    observers.destroy();
                    const fullExtent = new Extent({
                        "xmin": -20037507.067161843,
                        "ymin": -19971868.880408604,
                        "xmax": 20037507.067161843,
                        "ymax": 19971868.8804085,
                        "spatialReference": {
                            "wkid": 102100,
                            "latestWkid": 3857
                        }
                    });
                    return when(that._coordinateTransformer.transform(fullExtent, view.spatialReference.wkid),
                        (transformedExtent) => {
                            resolve(transformedExtent);
                        });
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
