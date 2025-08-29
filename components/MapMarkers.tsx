import React from "react";
import { NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";
import { Marker } from "../data/sampleMarkers";

interface MapMarkersProps {
  markers: Marker[];
  onMarkerTap: (marker: Marker) => void;
  zoomLevel: number;
}

const getDbMarkerImage = (marker: Marker) => {
  // 우리 DB(내 가게)라면 카테고리별 커스텀 마커, 없으면 기본
  switch (marker.description) {
    case "station":
      return require("./src/station.png");
    case "sponsor":
      return require("./src/starbucks.png");
    case "culture":
      return require("./src/culture.png");
    case "recommendation":
      return require("./src/recommendation.png");
    default:
      return require("./src/black.png");
  }
};

const MapMarkers: React.FC<MapMarkersProps> = ({
  markers,
  onMarkerTap,
  zoomLevel,
}) => {
  return (
    <>
      {markers.map((marker) => {
        // 우리 DB(내 가게)라면 store가 존재
        const isDb = !!marker.store;
        const image = isDb
          ? getDbMarkerImage(marker)
          : require("./src/black.png");
        // 외부 검색 결과는 항상 기본 마커(black.png)
        return zoomLevel >= 18 ? (
          <NaverMapMarkerOverlay
            key={marker.id}
            latitude={marker.latitude}
            longitude={marker.longitude}
            onTap={() => onMarkerTap(marker)}
            caption={{ text: marker.caption }}
            subCaption={{ text: marker.subCaption }}
            image={image}
            width={45}
            height={48}
          />
        ) : (
          <NaverMapMarkerOverlay
            key={marker.id}
            latitude={marker.latitude}
            longitude={marker.longitude}
            onTap={() => onMarkerTap(marker)}
            image={image}
            width={45}
            height={48}
          />
        );
      })}
    </>
  );
};

export default MapMarkers;
