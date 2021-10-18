# dn_selectionactions

This bundle provides additional selection input actions for map.apps selection-services bundle.

## Usage

Add the bundle "dn_selectionactions" to your map.apps 4 app.

Configure the available selection methods in the selection-ui bundle. The ones added by this bundle are the following:
- current_extent
- full_extent
- area_select
- circle
- graphic
- searchaction

```json
"selection-ui": {
    "Config": {
        "selectionMethods": ["rectangle", "polygon", "circle", "area_select"]
    }
}
```

## Configuration Reference

### CircleSpatialInputWidgetModel:
```json
"CircleSpatialInputWidgetModel": {
    "enableDonut": true,
    "minRadius": 0,
    "maxRadius": 500000,
    "innerRadius": 50000,
    "outerRadius": 100000,
    "stepSize": 1000,
    "unit": "meters"
}
```

| Property                       | Type    | Possible Values                                        | Default      | Description                                                                                                             |
|--------------------------------|---------|--------------------------------------------------------|--------------|------------------------------------------------------------------------------------------------------------------------ |
| enableDonut                    | Boolean | ```true``` &#124; ```false```                          | ```true```   | Enable inner and outer radius. If disabled only outer radius will be used.                                              |
| minRadius                      | Number  |                                                        | ```0```      | Minimal radius                                                                                                          |
| maxRadius                      | Number  |                                                        | ```500000``` | Maximum radius                                                                                                          |
| innerRadius                    | Number  |                                                        | ```50000```  | Initial inner radius                                                                                                    |
| outerRadius                    | Number  |                                                        | ```100000``` | Initial outer radius                                                                                                    |
| stepSize                       | Number  |                                                        | ```1000```   | Step size                                                                                                               |
| unit                           | String  | ```meters``` &#124; ```kilometers``` &#124; ```feet``` | ```meters``` | Circle radius unit (https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Circle.html#radiusUnit) |

### AreaSelectSpatialInputWidgetModel:
Use _selection-actions-area_ useIn-property to show stores in the area selection widget.
Use the priority property to to define an order of the stores (Stores with a higher priority are placed at the top of the store selection list).

```json
{
    "id": "bundeslaender",
    "url": "https://services.conterra.de/arcgis/rest/services/common/grenzen/FeatureServer/2",
    "title": "Bundesländer",
    "description": "Bundesländer",
    "fetchIdProperty": true,
    "filterOptions": {
        "suggestContains": true
    },
    "priority": 2,
    "useIn": [
        "selection",
        "selection-actions-area"
    ]
}
```
