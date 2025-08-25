import React, { useEffect, useState } from 'react';
import { NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';
import axios from 'axios';
import { Marker } from '../data/sampleMarkers';

interface MapMarkersProps {
  markers: Marker[];
  onMarkerTap: (marker: Marker) => void;
}

const API_URL = "http://172.30.1.64:3000";

const MapMarkers: React.FC<MapMarkersProps> = ({ onMarkerTap }) => {
  const [markers, setMarkers] = useState<Marker[]>([]);

  const fetchMarkers = async () => {
    try {
      const res = await axios.get(`${API_URL}/store/initialmap`);
      const data = res.data.map((store: any) => ({
        id: store.id,
        latitude: parseFloat(store.latitude),
        longitude: parseFloat(store.longitude),
        caption: store.name,
        subCaption: store.category,
        description: store.address,
        image: store.imageUrl
      }));
      setMarkers(data);
    } catch (err) {
      console.error('Failed to fetch markers:', err);
    }
  };

  useEffect(() => {
    fetchMarkers();
  }, []);

  return (
    <>
      {markers.map(marker => (
        <NaverMapMarkerOverlay
          key={marker.id}
          latitude={marker.latitude}
          longitude={marker.longitude}
          onTap={() => onMarkerTap(marker)}
          caption={{ text: marker.caption }}
          subCaption={{ text: marker.subCaption }}
          image={ marker.subCaption === 'station' ? require(`./src/station.png`) : require(`./src/sponsor.png`)}
        />
      ))}
    </>
  );
};

export default MapMarkers;
