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
        <div v-if="enableDonut">{{ i18n.innerRadius }}</div>
        <v-layout
            v-if="enableDonut"
            row
            wrap
            justify-space-between>
            <v-flex
                grow
                px-3>
                <v-slider
                    v-model="innerRadius"
                    :min="minRadius"
                    :max="maxRadius"
                    :step="stepSize"
                    hide-details/>
            </v-flex>
            <v-flex shrink>
                <v-text-field
                    v-model="innerRadius"
                    :step="stepSize"
                    :suffix="unitSuffix"
                    type="number"
                    hide-details
                />
            </v-flex>
        </v-layout>
        <div v-if="enableDonut">{{ i18n.outerRadius }}</div>
        <div v-else>{{ i18n.radius }}</div>
        <v-layout
            row
            wrap
            justify-space-between>
            <v-flex
                grow
                px-3>
                <v-slider
                    v-model="outerRadius"
                    :min="minRadius"
                    :max="maxRadius"
                    :step="stepSize"
                    hide-details/>
            </v-flex>
            <v-flex shrink>
                <v-text-field
                    v-model="outerRadius"
                    :step="stepSize"
                    :suffix="unitSuffix"
                    type="number"
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
        props: {
            innerRadius: {
                type: Number,
                default: 0
            },
            outerRadius: {
                type: Number,
                default: 100000
            },
            minRadius: {
                type: Number,
                default: 0
            },
            maxRadius: {
                type: Number,
                default: 500000
            },
            stepSize: {
                type: Number,
                default: 1000
            },
            unit: {
                type: String,
                default: "meters"
            },
            enableDonut: {
                type: Boolean,
                default: true
            },
            i18n: {
                type: Object,
                default: () => {
                    return {
                        title: "Circle",
                        description: "Click on the map to select objects using a circle."
                    }
                }
            }
        },
        computed: {
            unitSuffix: function () {
                switch (this.unit) {
                    case "meters":
                        return "m";
                    case "kilometers":
                        return "km";
                    case "feet":
                        return "ft";
                    case "miles":
                        return "mi";
                    case "nautical-miles":
                        return "nmi";
                    case "yards":
                        return "yd";
                    default:
                        return "";
                }
            }
        }
    };
</script>
