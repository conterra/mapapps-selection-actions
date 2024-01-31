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
import {declare} from "apprt-core/Mutable";

export default declare({

    storeData: [],
    selectedStoreId: null,
    stores: [],
    buffer: 0,
    minBuffer: 0,
    maxBuffer: 1000,
    unit: "meters",
    stepSize:1000,

    activate() {
        const properties = this._properties;
        this.storeIds = properties.storeIds;
        this._getStoreData();
    },

    addStore(store, properties) {
        properties = properties || {};
        const id = store && store.id;
        if (!id) {
            console.debug("Store has no id and will be ignored!");
            return;
        }
        const newStores = this.stores.slice(0);
        const index = newStores.findIndex((s) => s.id === id);
        if (index >= 0) {
            console.warn(`Store with id '${id}' was already registered! It is replaced by the new store.`);
            newStores.splice(index, 1);
        }
        newStores.push({
            id: id,
            title: store.title || properties.title || id,
            description: store.description || properties.description || "",
            priority: properties.priority || 0
        });
        this.stores = newStores;
        this._getStoreData();
    },

    removeStore(store) {
        const id = store && store.id;
        if (!id) {
            return;
        }
        const stores = this.stores;
        const index = stores.findIndex((s) => s.id === id);
        if (index < 0) {
            return;
        }
        const newStores = stores.slice(0);
        newStores.splice(index, 1);
        this.stores = newStores;
        this._getStoreData();
    },

    _getStoreData() {
        const stores = this.stores;
        const storeData = stores.map((store) => {
            return {
                id: store.id,
                name: store.title,
                priority: store.priority
            };
        });
        storeData.sort((a, b) => {
            if (a.priority > b.priority) {
                return -1;
            }
            if (a.priority < b.priority) {
                return 1;
            }
            return 0;
        });
        this.storeData = storeData;
        if (this.storeData.length && !this.selectedStoreId) {
            this.selectedStoreId = this.storeData[0].id;
        }
    },

    _getFilteredStores() {
        return this.stores.filter((store) => this.storeIds.includes(store.id));
    }

});
