/*
 * Copyright (C) 2024 con terra GmbH (info@conterra.de)
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
    bundleName: "Selection Actions",
    bundleDescription: "Dieses Bundle stellt zus\u00e4tzliche Selektionsmethoden zur Verf\u00fcgung",
    ui: {
        current_extent: {
            title: "Kartenausschnitt",
            description: "Klicken Sie in die Karte, um Objekte im aktuellen Kartenausschnitt auszuw\u00e4hlen."
        },
        full_extent: {
            title: "\u00dcberall",
            description: "Klicken Sie in die Karte, um \u00fcberall nach Objekten zu suchen."
        },
        area_select: {
            title: "Gebiet",
            description: "Klicken Sie in die Karte, um ein Gebiet auszuw\u00e4hlen.",
            widgetTitle: "Gebietsauswahl konfigurieren",
            source: "Datenquelle ausw\u00e4hlen",
            buffer: "Buffer"
        },
        circle: {
            title: "Kreis",
            description: "Klicken Sie in die Karte, um anhand eines Kreises Objekte auszuw\u00e4hlen.",
            widgetTitle: "Kreisselektion konfigurieren",
            innerRadius: "Innerer Radius",
            outerRadius: "Äußerer Radius",
            radius: "Radius",
            adjustStepSize: "Schrittweite an Maßstab anpassen"
        },
        search: {
            title: "Suchergebnis",
            description: "Finden Sie ein Feature \u00fcber die Suche und verwenden Sie dessen Geometrie, um Objekte auszuw\u00e4hlen."
        },
        graphic: {
            title: "Grafik",
            description: "Klicken Sie auf eine Grafik in der Karte, um Objekte auszuw\u00e4hlen.",
            widgetTitle: "Grafikauswahl konfigurieren",
            buffer: "Buffer"
        },
        multipoint: {
            title: "Multiselect",
            description: "Klicken Sie auf die Karte um mehrere Punkte auszuwählen. Die Selektion wird per Doppelklick beendet."
        },
        polyline: {
            title: "Polylinie",
            description: "Klicken Sie auf die Karte mittels einer Polylinie auszuwählen. Die Selektion wird per Doppelklick beendet"
        }
    }
};
