<template>
    <v-container grid-list-md pa-1>
        <div>{{i18n.innerRadius}}</div>
        <v-layout row wrap justify-space-between>
            <v-flex md10 px-3>
                <v-slider v-model="innerRadius" v-bind:min="minRadius" v-bind:max="maxRadius" v-bind:step="stepSize"
                          hide-details></v-slider>
            </v-flex>
            <v-flex md2>
                <v-text-field
                        v-model="innerRadius" v-bind:step="stepSize" type="number" suffix="m" hide-details
                ></v-text-field>
            </v-flex>
        </v-layout>
        <div>{{i18n.outerRadius}}</div>
        <v-layout row wrap justify-space-between>
            <v-flex md10 px-3>
                <v-slider v-model="outerRadius" v-bind:min="minRadius" v-bind:max="maxRadius" v-bind:step="stepSize"
                          hide-details></v-slider>
            </v-flex>
            <v-flex md2>
                <v-text-field
                        v-model="outerRadius" v-bind:step="stepSize" type="number" suffix="m" hide-details
                ></v-text-field>
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
