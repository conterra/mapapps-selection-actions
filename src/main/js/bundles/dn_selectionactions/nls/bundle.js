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
module.exports = {
    root: ({
        bundleName: "Selection Actions",
        bundleDescription: "This bundle provides additional selection methods.",
        ui: {
            current_extent: {
                title: "Map Extent",
                description: "Click on the map to use the current map extent to select objects."
            },
            full_extent: {
                title: "Everywhere",
                description: "Click on the map to select objects everywhere."
            },
            area_select: {
                title: "Area",
                description: "Click on the map to select an area.",
                widgetTitle: "Configure area selection",
                source: "Select source",
                buffer: "Buffer"
            },
            circle: {
                title: "Circle",
                description: "Click on the map to select objects using a circle.",
                widgetTitle: "Configure circle selection",
                innerRadius: "Inner Radius",
                outerRadius: "Outer Radius",
                radius: "Radius",
                adjustStepSize: "Adjust Step Size to Scale"
            },
            search: {
                title: "Searchresult",
                description: "Find a feature via the omnisearch and use it's geometry to select objects."
            },
            graphic: {
                title: "Graphic",
                description: "Select a graphic in the map to select objects."
            },
            multipoint: {
                title: "Multiselect",
                description: "Click on the map to add multiple points to select objects. Double click finishes the selection."
            }
        }
    }),
    "de": true
};
