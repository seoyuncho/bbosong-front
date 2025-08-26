import React, { useEffect, useState } from "react";
import { NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";
import { Marker } from "../data/sampleMarkers";

interface MapMarkersProps {
  markers: Marker[];
  onMarkerTap: (marker: Marker) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ markers, onMarkerTap }) => {
  console.log("Rendering MapMarkers")
  return (
    <>
      {markers.map((marker) => (
      <NaverMapMarkerOverlay
        key={marker.id}
        latitude={marker.latitude}
        longitude={marker.longitude}
        onTap={() => onMarkerTap(marker)}
        caption={{ text: marker.caption }}
        subCaption={{ text: marker.subCaption }}
        image={
        marker.description === "station"
          ? require(`./src/station.png`)
          : marker.description === "sponsor"
          ? require(`./src/sponsor.png`)
          : marker.description === "culture"
          ? require(`./src/culture.png`)
          : marker.description === "recommendation"
          ? require(`./src/recommendation.png`)
          : { symbol: "gray" }
        }
      />
      ))}
    </>
  );
};

export default MapMarkers;
