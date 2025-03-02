import React, { useEffect, useRef } from 'react';

// 🔹 Importation explicite des modules OpenLayers
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Select from 'ol/interaction/Select';
import { Icon, Style } from 'ol/style';

type WebMapProps = {
  latitude: number;
  longitude: number;
  markers: Array<{ id: string; latitude: number; longitude: number }>;
  onMarkerPress: (markerId: string) => void;
};

const WebMap: React.FC<WebMapProps> = ({ latitude, longitude, markers, onMarkerPress }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Création de la carte
    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: fromLonLat([longitude, latitude]),
        zoom: 15
      })
    });

    // Création de la couche pour les marqueurs
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({ source: vectorSource });
    map.addLayer(vectorLayer);

    // Ajout des marqueurs
    markers.forEach(marker => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([marker.longitude, marker.latitude])),
        id: marker.id
      });

      feature.setStyle(new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'https://png.pngtree.com/png-clipart/20230410/ourmid/pngtree-go-green-little-plant-png-image_6698190.png',
          scale: 0.5
        })
      }));

      vectorSource.addFeature(feature);
    });

    // Ajout de l'interaction de sélection
    const select = new Select();
    map.addInteraction(select);

    select.on('select', function (e) {
      if (e.selected.length > 0) {
        const markerId = e.selected[0].get('id');
        if (markerId) onMarkerPress(markerId);
      }
    });

    return () => map.setTarget(undefined);
  }, [latitude, longitude, markers]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default WebMap;
