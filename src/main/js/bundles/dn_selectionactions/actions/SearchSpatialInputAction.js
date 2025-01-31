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

export default class SearchSpatialInputAction {

    activate() {
        const i18n = this.i18n = this._i18n.get().ui.search;
        this.id = "searchaction";
        this.title = i18n.title;
        this.description = i18n.description;
        this.iconClass = "icon-magnifier";
        this.interactive = false;
        this._input = null;
    }

    // omnisearch handle method
    handle(item) {
        this._input = item;
    }

    // search-api handle method
    _handleSearchApiResult(evt) {
        this._input = evt.getProperty("item");
    }

    // hierarchical search handle method
    _handleHierarchicalSearchResult(evt) {
        this._input = evt.getProperty("result");
    }

    getInput() {
        return this._input;
    }

    trigger() {
        return new CancelablePromise((resolve, reject, oncancel) => {
            const inputGeometry = this._input && this._input.geometry;
            if (!inputGeometry) {
                reject("No SearchInputActionGeometry was is defined");
            } else {
                resolve(inputGeometry);
            }

            oncancel(() => {
                console.debug("SearchInputAction was canceled...");
            });
        });
    }
}
