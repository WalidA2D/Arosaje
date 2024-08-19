import React from 'react';
import { WebView } from 'react-native-webview';

const OpenLayersMap = ({ latitude, longitude, markers, onMarkerPress }) => {
  const markersJSArray = JSON.stringify(markers);

  const html = `
<!DOCTYPE html>
<html>
<head>
<title>OpenLayers Map</title>
<link rel="stylesheet" href="https://openlayers.org/en/v6.5.0/css/ol.css" type="text/css">
<style>
        #map {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
</style>
<script src="https://openlayers.org/en/v6.5.0/build/ol.js"></script>
</head>
<body>
<div id="map" class="map"></div>
<script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
          var map = new ol.Map({
            target: 'map',
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM()
              })
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([${longitude}, ${latitude}]),
              zoom: 18 
            })
          });
 
          var radius = 100;
          var circle = new ol.geom.Circle(ol.proj.fromLonLat([${longitude}, ${latitude}]), radius);
          var circleFeature = new ol.Feature(circle);
 
          var vectorSource = new ol.source.Vector({
            features: [circleFeature]
          });
 
          var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: new ol.style.Style({
              stroke: new ol.style.Stroke({
                color: 'blue',
                width: 2
              }),
              fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 0.1)'
              })
            })
          });
 
          map.addLayer(vectorLayer);
 
          var iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
              anchor: [0.5, 1],
              src: 'https://png.pngtree.com/png-clipart/20230410/ourmid/pngtree-go-green-little-plant-png-image_6698190.png',
              scale: 0.5
            })
          });
 
          var markers = ${markersJSArray};
 
          markers.forEach(function(marker) {
            var iconFeature = new ol.Feature({
              geometry: new ol.geom.Point(ol.proj.fromLonLat([marker.longitude, marker.latitude]))
            });
 
            iconFeature.setStyle(iconStyle);
 
            // Add click event listener to the marker
            iconFeature.on('click', function() {
              onMarkerPress(marker);
            });
 
            vectorSource.addFeature(iconFeature);
          });
        });
</script>
</body>
</html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      style={{ flex: 1 }}
    />
  );
};

export default OpenLayersMap;