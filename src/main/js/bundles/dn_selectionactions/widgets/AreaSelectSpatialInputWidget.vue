<!--

    Copyright (C) 2020 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <v-container
        grid-list-md
        pa-1>
        <v-select
            v-model="selectedStoreId"
            :items="storeData"
            item-text="name"
            item-value="id"
            :label="i18n.source"
            hide-details
        ></v-select>
    </v-container>
</template>
<script>
    import Bindable from "apprt-vue/mixins/Bindable";

    export default {
        mixins: [Bindable],
        props: {
            storeData: {
                type: Array,
                default: () => []
            },
            selectedStoreId: {
                type: String,
                default: ""
            },
            i18n: {
                type: Object,
                default: () => {
                    return {
                        source: "Datenquelle"
                    }
                }
            }
        }

    };
</script>
