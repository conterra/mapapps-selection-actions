# dn_selectionactions

This bundle provides additional selection input actions for map.apps selection-services bundle.

## Usage

Add the bundle "dn_selectionactions" to your map.apps 4 app.

Configure the available selection methods in the selection-ui bundle. The ones added by this bundle are the following:
- current_extent
- full_extent
- circle
- graphic
- searchaction

```json
"selection-ui": {
    "Config": {
        "selectionMethods": ["extent", "point"]
    }
}
```

## Configuration Reference

### CircleSpatialInputWidgetModel:
```json
"CircleSpatialInputWidgetModel": {
    "minRadius": 0,
    "maxRadius": 500000,
    "innerRadius": 50000,
    "outerRadius": 100000,
    "stepSize": 1000
}
```

| Property                       | Type    | Possible Values                 | Default    | Description                       |
|--------------------------------|---------|---------------------------------|------------|---------------------------------- |
| minRadius                      | number  |                                 | 0          | Minimal radius                    |
| maxRadius                      | number  |                                 | 500000     | Maximum radius                    |
| innerRadius                    | number  |                                 | 50000      | Initial inner radius              |
| outerRadius                    | number  |                                 | 100000     | Initial outer radius              |
| stepSize                       | number  |                                 | 1000       | Step size                         |
