<template>
    <v-container
        grid-list-md
        pa-1
    >
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
                    :min="minBuffer"
                    :max="maxBuffer"
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
            minBuffer: {
                type: Number,
                default: 0
            },
            maxBuffer: {
                type: Number,
                default: 5000
            },
            stepSize: {
                type: Number,
                default: 1
            },
            unit: {
                type: String,
                default: "meters"
            },
            i18n: {
                type: Object,
                default: () => {
                    return {
                    };
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
