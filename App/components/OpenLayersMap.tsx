import React, { useImperativeHandle, forwardRef } from 'react';
import { Platform, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import WebMap from './WebMap'; 

type OpenLayersMapProps = {
  latitude: number;
  longitude: number;
  markers: Array<{ id: string; latitude: number; longitude: number }>;
  onMarkerPress: (markerId: string) => void;
};

// ✅ Vérifier la plateforme et afficher la bonne version
const OpenLayersMap = forwardRef(({ latitude, longitude, markers, onMarkerPress }: OpenLayersMapProps, ref) => {
  if (Platform.OS === 'web') {
    return <WebMap latitude={latitude} longitude={longitude} markers={markers} onMarkerPress={onMarkerPress} />;
  }

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: generateHTML(latitude, longitude, markers) }}
      style={{ flex: 1 }}
      onMessage={(event) => {
        const markerId = event.nativeEvent.data;
        if (markerId) {
          onMarkerPress(markerId);
        }
      }}
    />
  );
});

export default OpenLayersMap;

// ✅ Fonction qui génère le HTML pour WebView (mobile)
const generateHTML = (latitude: number, longitude: number, markers: any[]) => `
  <!DOCTYPE html>
  <html>
  <head>
  <title>OpenLayers Map</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v10.0.0/ol.css" type="text/css">
  <script src="https://cdn.jsdelivr.net/npm/ol@v10.0.0/dist/ol.js"></script>
  <style>
    #map { width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
  </style>
  </head>
  <body>
  <div id="map"></div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      var map = new ol.Map({
        target: 'map',
        layers: [ new ol.layer.Tile({ source: new ol.source.OSM() }) ],
        view: new ol.View({
          center: ol.proj.fromLonLat([${longitude}, ${latitude}]),
          zoom: 18
        })
      });

      var vectorSource = new ol.source.Vector();
      var vectorLayer = new ol.layer.Vector({ source: vectorSource });
      map.addLayer(vectorLayer);

      var markers = ${JSON.stringify(markers)};
      markers.forEach(function(marker) {
        var iconFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([marker.longitude, marker.latitude])),
          id: marker.id
        });

        iconFeature.setStyle(new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: 'https://png.pngtree.com/png-clipart/20230410/ourmid/pngtree-go-green-little-plant-png-image_6698190.png',
            scale: 0.5
          })
        }));

        vectorSource.addFeature(iconFeature);
      });

      var select = new ol.interaction.Select();
      map.addInteraction(select);

      select.on('select', function(e) {
        if (e.selected.length > 0) {
          var markerId = e.selected[0].get('id');
          if (markerId) {
            window.ReactNativeWebView.postMessage(markerId);
          }
        }
      });
    });
  </script>
  </body>
  </html>
`;

