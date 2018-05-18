/*
 * Copyright (C) 2018 con terra GmbH (info@conterra.de)
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
    bundleName: "Selection Services",
    bundleDescription: "Dieses Bundle stellt zus\u00e4tzliche Selektionsmethoden zur Verf\u00fcgung",
    ui: {
        current_extent: {
            title: "Kartenausschnitt",
            description: "Verwendet den aktuellen Kartenausschnitt, um Objekte auszuw\u00e4hlen."
        },
        circle: {
            title: "Kreis",
            description: "Klicken Sie in die Karte, um anhand eines Kreises Objekte auszuw\u00e4hlen.",
            widgetTitle: "Kreisselektion konfigurieren",
            innerRadius: "Innerer Radius",
            outerRadius: "Äußerer Radius"
        }
    }
};
