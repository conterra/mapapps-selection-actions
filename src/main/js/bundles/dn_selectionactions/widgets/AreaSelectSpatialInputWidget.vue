<!--

    Copyright (C) 2023 con terra GmbH (info@conterra.de)

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
        pa-1
    >
        <v-select
            v-model="selectedStoreId"
            :items="storeData"
            item-text="name"
            item-value="id"
            :label="i18n.source"
            hide-details
        />

        <v-layout
            row
            wrap
            justify-space-between
        >
            <v-flex
                grow
                px-3
            >
                <div>
                    {{ i18n.buffer }}
                </div>
                <v-slider
                    v-model="buffer"
                    :step="stepSize"
                    hide-details
                />
            </v-flex>
            <v-flex shrink>
                <v-text-field
                    v-model="buffer"
                    :step="stepSize"
                    :suffix="unitSuffix"
                    type="number"
                    hide-details
                />
            </v-flex>
            <v-flex md12>
                <v-switch
                    v-model="adjustStepSize"
                    :label="i18n.adjustStepSize"
                    color="primary"
                    @change="$emit('adjustStepSize-changed', adjustStepSize)"
                />
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import Bindable from "apprt-vue/mixins/Bindable";

    export default {
        mixins: [Bindable],
        props: {
            buffer: {
                type: Number,
                default: 0
            },
            stepSize: {
                type: Number,
                default: 1000
            },
            unit: {
                type: String,
                default: "meters"
            },
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
                    };
                }
            }
        }
    };
</script>
