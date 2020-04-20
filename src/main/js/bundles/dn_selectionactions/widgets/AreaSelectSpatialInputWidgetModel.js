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
import {declare} from "apprt-core/Mutable";
import when from "apprt-core/when";

export default declare({

    storeData: [],
    selectedStoreId: null,
    stores: [],

    activate() {
        const properties = this._properties;
        this.storeIds = properties.storeIds;
        this._getStoreData();
    },

    addStore(store) {
        this.stores.push(store);
        this._getStoreData();
    },

    _getStoreData() {
        const filteredStores = this.stores;
        const promises = filteredStores.map((store) => new Promise((resolve, reject) => {
            when(store.getMetadata(), (metadata) => {
                resolve({
                    id: store.id,
                    name: metadata.name
                });
            })
        }));
        Promise.all(promises).then((storeData) => {
            this.storeData = storeData;
            if (this.storeData.length && !this.selectedStoreId) {
                this.selectedStoreId = this.storeData[0].id;
            }
        })
    },

    _getFilteredStores() {
        return this.stores.filter((store) => {
            return this.storeIds.includes(store.id);
        });
    }

});
