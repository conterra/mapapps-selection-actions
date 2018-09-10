# Selection Actions
This bundle provides additional selection input actions for map.apps selection-services bundle.

![Screenshot App](https://github.com/conterra/mapapps-selection-actions/blob/master/Screenshot.JPG)

Sample App
------------------
https://demos.conterra.de/mapapps/resources/apps/downloads_selectionactions/index.html

Installation Guide
------------------
**Requirement: map.apps 4.3.0**

Add the bundle "dn_selectionactions" to your map.apps 4 app.

Configure the available selection methods in the selection-ui bundle. The ones added by this bundle are the following:
- current_extent
- circle
- omnisearch

```
"bundles": {
    ...
    "selection-ui": {
        "Config": {
                "selectionMethods": ["extent", "point"]
        }
    }
    ...
}
```

#### Configurable Components of dn_selectionactions:

##### CircleSpatialInputWidgetModel:
```
"CircleSpatialInputWidgetModel": {
    "minRadius": 0,
    "maxRadius": 500000,
    "innerRadius": 50000,
    "outerRadius": 100000,
    "stepSize": 1000
}
```

###### CircleSpatialInputWidgetModel Properties
| Property                       | Type    | Possible Values                 | Default    | Description                       |
|--------------------------------|---------|---------------------------------|------------|---------------------------------- |
| minRadius                      | number  |                                 | 0          | Minimal radius                    |
| maxRadius                      | number  |                                 | 500000     | Maximum radius                    |
| innerRadius                    | number  |                                 | 50000      | Initial inner radius              |
| outerRadius                    | number  |                                 | 100000     | Initial outer radius              |
| stepSize                       | number  |                                 | 1000       | Step size                         |

Development Guide
------------------
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

##### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`
