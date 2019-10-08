<!--

    Copyright (C) 2019 con terra GmbH (info@conterra.de)

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
        <div>{{ i18n.innerRadius }}</div>
        <v-layout
            row
            wrap
            justify-space-between>
            <v-flex
                md10
                px-3>
                <v-slider
                    v-model="innerRadius"
                    :min="minRadius"
                    :max="maxRadius"
                    :step="stepSize"
                    hide-details/>
            </v-flex>
            <v-flex md2>
                <v-text-field
                    v-model="innerRadius"
                    :step="stepSize"
                    type="number"
                    suffix="m"
                    hide-details
                />
            </v-flex>
        </v-layout>
        <div>{{ i18n.outerRadius }}</div>
        <v-layout
            row
            wrap
            justify-space-between>
            <v-flex
                md10
                px-3>
                <v-slider
                    v-model="outerRadius"
                    :min="minRadius"
                    :max="maxRadius"
                    :step="stepSize"
                    hide-details/>
            </v-flex>
            <v-flex md2>
                <v-text-field
                    v-model="outerRadius"
                    :step="stepSize"
                    type="number"
                    suffix="m"
                    hide-details
                />
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
    import Bindable from "apprt-vue/mixins/Bindable";

    export default {
        mixins: [Bindable],
        data: function () {
            return {
                innerRadius: 0,
                outerRadius: 100,
                i18n: {
                    type: Object,
                    default: function () {
                        return {
                            title: "Circle",
                            description: "Click on the map to select objects using a circle."
                        }
                    }
                }
            };
        },
        methods: {}

    };
</script>
