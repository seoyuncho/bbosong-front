import React from 'react';
import { NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';

interface Marker {
  id: string;
  latitude: number;
  longitude: number;
  caption: string;
  subCaption: string;
  description: string;
  image: { symbol: string };
}

interface MapMarkersProps {
  markers: Marker[];
  onMarkerTap: (marker: Marker) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ markers, onMarkerTap }) => {
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
          //image={marker.image}
        />
      ))}
    </>
  );
};

export default MapMarkers;
