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

class SearchInputAction {

    activate(componentContext) {
        this._bundleContext = componentContext.getBundleContext();
        let i18n = this.i18n = this._i18n.get().ui.search;
        this.id = "searchSelect";
        this.title = i18n.title;
        this.description = i18n.description;
        this.componentName = "searchInputWidget";
        this._inputGeometry = null;
        this.iconClass = "icon-magnifier";
    }

    handle(item) {
        this._inputGeometry = item;

    }
    trigger() {
        return new CancelablePromise((resolve, reject, oncancelled) => {
            let inputGeometry = this._inputGeometry;
            if (!inputGeometry) {
                reject("No Geometry is defined!");
            } else {
                resolve(inputGeometry.geometry);
            }

            oncancelled('Selection cancelled')

        });
    }


}

export default SearchInputAction;