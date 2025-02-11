document.addEventListener('DOMContentLoaded', function(event) {
    var osmTiles = new ol.layer.Tile({
        title: 'Open Street Map',
        visible: true, 
        type: 'base',
        source: new ol.source.OSM(),
    });

    var odisha = new ol.layer.Tile({
        title: 'Odisha Administrative Boundary',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:odishashp', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: true
    });

    var landUse = new ol.layer.Tile({
        title: 'Land Use Land Cover',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:landuse', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false
    });

    var blockMap = new ol.layer.Tile({
        title: 'Odisha Block',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:block_bnd', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false

    });

    var distMap = new ol.layer.Tile({
        title: 'Odisha District',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:dist', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: true

    });

    var bbsrMap = new ol.layer.Tile({
        title: 'Bhubaneswar Boundary',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:bhubaneswar1', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var forestMap = new ol.layer.Tile({
        title: 'Forest Boundary',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:forest_boundary', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var hospitalMap = new ol.layer.Tile({
        title: 'Hospital',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:hospital', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var h_building_point = new ol.layer.Tile({
        title: 'Hospital Building',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:hospital_footpoint', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var industryMap = new ol.layer.Tile({
        title: 'Industry',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:industry', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var i_building_point = new ol.layer.Tile({
        title: 'Industry Building',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:industrypoint', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var parkMap = new ol.layer.Tile({
        title: 'Parks and Play Grounds',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:park&playground', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

        
    });

    var road_map = new ol.layer.Tile({
        title: 'Roads',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:road1', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var universitiesMap = new ol.layer.Tile({
        title: 'Universities',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:university', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var u_building_point = new ol.layer.Tile({
        title: 'University Building',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:university_building_footpoints', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var sentinel1 = new ol.layer.Tile({
        title: 'Sentinel 1',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:sentinel1', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var sentinel2 = new ol.layer.Tile({
        title: 'Sentinel 2',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:Sentinel2_Bbsr_MeanImage4', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var sentinel2_landcover = new ol.layer.Tile({
        title: 'Sentinel 1 and 2 Landcover',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:Sentinel2_landcover', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var sentinel3 = new ol.layer.Tile({
        title: 'Sentinel 3',
        source: new ol.source.TileWMS({
            url: 'http://localhost:8081/geoserver/usdi/wms',
            params: { 'LAYERS': 'usdi:s3_bbsr1', 'TILED': true },
            serverType: 'geoserver',
            transition: 0,
        }),
        visible: false,

    });

    var noneTile = new ol.layer.Tile({
        title: 'None',
        type: 'base',
        visible: false
    });

    var map = new ol.Map({
        target: 'map',
        view: new ol.View({
            projection: 'EPSG:4326',
            center: [84.77580017089844, 20.320094757080078],
            zoom: 7
        })
    });

    var baseGroup = new ol.layer.Group({
        title: 'Base Maps',
        fold: true,
        layers: [osmTiles, noneTile]
    });

    map.addLayer(baseGroup);

    var pointGroup = new ol.layer.Group({
        title: 'Infrastructure',
        fold: true,
        layers: [hospitalMap, industryMap, parkMap, universitiesMap, road_map, i_building_point, h_building_point, u_building_point]
    });

    map.addLayer(pointGroup);


    var rasterGroup = new ol.layer.Group({
        title: 'Raster Layer',
        fold: true,
        layers: [ sentinel1,  sentinel2, sentinel2_landcover, sentinel3, landUse ]
    });

    map.addLayer(rasterGroup);

    var overlayGroup = new ol.layer.Group({
        title: 'Administrative Boundary',
        fold: true,
        layers: [ odisha,  distMap, blockMap, bbsrMap, forestMap ]
    });

    map.addLayer(overlayGroup);

    var layerSwitcher = new ol.control.LayerSwitcher({
        className: 'layerSwitcher',
        activationMode: 'click',
        startActive: false,
        groupSelectStyle: 'children'
    });

    map.addControl(layerSwitcher);

    var mousePosition = new ol.control.MousePosition({
        className: 'mousePosition',
        projection: 'EPSG:4326',
        coordinateFormat: function (coordinate) { return ol.coordinate.format(coordinate, '{y} , {x}', 6); }
    });

    map.addControl(mousePosition);

    var scaleControl = new ol.control.ScaleLine({
        bar: true,
        text: true,
    });

    map.addControl(scaleControl);

    var fullScreen = new ol.control.FullScreen();

    map.addControl(fullScreen);

    var slider = new ol.control.ZoomSlider();
    map.addControl(slider);



    var user_role = localStorage.getItem('user_role');
    if (!user_role) {
        console.error('User role is not defined');
        return;
    }

    document.getElementById('closeMapButton').addEventListener('click', function() {
        switch (user_role) {
            case 'admin':
                console.log('Admin user - map will be hidden');
                document.getElementById('map').style.display = 'none';
                window.location.href = 'admin_dashbord.html';
                break;
            case 'citizen':
                console.log('Citizen user - map will be hidden');
                document.getElementById('map').style.display = 'none';
                window.location.href = 'citizen_dashbord.html';
                break;
            default:
                console.log('Unknown user role');
                break;
        }
    });
});

