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
- multipoint

```json
"selection-ui": {
    "Config": {
        "selectionMethods": ["rectangle", "polygon", "circle", "area_select", "multipoint"]
    }
}
```

## Configuration Reference

### AreaSelectSpatialInputWidgetModel:

```json
"AreaSelectSpatialInputWidgetModel": {
    "buffer": 0,
    "stepSize": 1000,
    "unit": "meters"
}
```

| Property  | Type   | Possible Values                                        | Default      | Description                                                                                                             |
| --------- | ------ | ------------------------------------------------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| buffer    | Number |                                                        | ```0```      | Buffer                                                                                                                  |
| minBuffer | Number |                                                        | ```0```      | Minimal buffer                                                                                                          |
| maxBuffer | Number |                                                        | ```500000``` | Maximum buffer                                                                                                          |
| stepSize  | Number |                                                        | ```1000```   | Step size                                                                                                               |
| unit      | String | ```meters``` &#124; ```kilometers``` &#124; ```feet``` | ```meters``` | Buffer radius unit (https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Circle.html#radiusUnit) |

Use _selection-actions-area_ useIn-property to show stores in the area selection widget.
Use the priority property to define an order of the stores (Stores with a higher priority are placed at the top of the store selection list).

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

### CircleSpatialInputWidgetModel:

```json
"CircleSpatialInputWidgetModel": {
    "enableDonut": true,
    "minRadius": 0,
    "maxRadius": 500000,
    "innerRadius": 50000,
    "outerRadius": 100000,
    "stepSize": 1000,
    "adjustStepSize": false,
    "stepSizeRanges": [
        {
            "scaleRange": [1, 100000],
            "stepSize": 1
        },
        {
            "scaleRange": [100000, 100000000],
            "stepSize": 100
        }
    ],
    "unit": "meters"
}
```

| Property       | Type    | Possible Values                                        | Default          | Description                                                                                                             |
| -------------- | ------- | ------------------------------------------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| enableDonut    | Boolean | ```true``` &#124; ```false```                          | ```true```       | Enable inner and outer radius. If disabled only outer radius will be used.                                              |
| minRadius      | Number  |                                                        | ```0```          | Minimal radius                                                                                                          |
| maxRadius      | Number  |                                                        | ```500000```     | Maximum radius                                                                                                          |
| innerRadius    | Number  |                                                        | ```50000```      | Initial inner radius                                                                                                    |
| outerRadius    | Number  |                                                        | ```100000```     | Initial outer radius                                                                                                    |
| stepSize       | Number  |                                                        | ```1000```       | Step size                                                                                                               |
| adjustStepSize | Boolean | ```true``` &#124; ```false```                          | ```false```      | Enables or disables scale based stepSize adjustments                                                                    |
| stepSizeRanges | Array   |                                                        | ```see sample``` | Array containing objects with disjunct scale ranges desired stepSize for these ranges                                   |
| unit           | String  | ```meters``` &#124; ```kilometers``` &#124; ```feet``` | ```meters```     | Circle radius unit (https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Circle.html#radiusUnit) |

### GraphicSpatialInputWidgetModel:

```json
"GraphicSpatialInputWidgetModel": {
    "buffer": 0,
    "minBuffer": 0,
    "maxBuffer": 5000,
    "stepSize": 100,
    "unit": "meters"
}
```

| Property  | Type   | Possible Values                                        | Default      | Description                                                                                                             |
| --------- | ------ | ------------------------------------------------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| buffer    | Number |                                                        | ```0```      | Buffer                                                                                                                  |
| minBuffer | Number |                                                        | ```0```      | Minimal buffer                                                                                                          |
| maxBuffer | Number |                                                        | ```5000```   | Maximum buffer                                                                                                          |
| stepSize  | Number |                                                        | ```100```    | Step size                                                                                                               |
| unit      | String | ```meters``` &#124; ```kilometers``` &#124; ```feet``` | ```meters``` | Buffer radius unit (https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Circle.html#radiusUnit) |

### MultiPointSpatialInputAction
The MultiPointSpatialInputAction allows for the configuration of buffering around the clicked location. The default value and necessary configuration are depicted below.

````json
 "dn_selectionactions": {
    "MultiPointSpatialInputAction": {
        "clickTolerance": 5
    }
}
````

