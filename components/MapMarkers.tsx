import React from "react";
import { NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";
import { Marker } from "../data/sampleMarkers";

interface MapMarkersProps {
  markers: Marker[];
  onMarkerTap: (marker: Marker) => void;
  zoomLevel: number;
  selectedTag?: string; // 추가된 부분
}

// 해시태그별 마커 이미지 매핑
const hashtagImageMap: Record<string, any> = {
  // recommendation
  "#hot": require("./src/recommendation-hot.png"),
  "#cool": require("./src/recommendation-cool.png"),
  "#cafe": require("./src/recommendation-cafe.png"),
  "#rain": require("./src/recommendation-rain.png"),
  // culture
  "culture-hot": require("./src/culture-hot.png"),
  "culture-cool": require("./src/culture-cool.png"),
  "culture-cafe": require("./src/culture-cafe.png"),
  "culture-rain": require("./src/culture-rain.png"),
};

const getDbMarkerImage = (marker: Marker, selectedTag?: string) => {
  // 해시태그가 선택된 경우 store/culture만 해시태그별 이미지 적용
  if (selectedTag && marker.description) {
    if (
      marker.description === "recommendation" &&
      hashtagImageMap[selectedTag]
    ) {
      return hashtagImageMap[selectedTag];
    }
    if (marker.description === "culture") {
      // selectedTag가 #hot이면 key는 'culture-hot'
      const key = `culture-${selectedTag.replace("#", "")}`;
      if (hashtagImageMap[key]) {
        return hashtagImageMap[key];
      }
    }
  }
  // 기본 카테고리별 마커
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
  selectedTag,
}) => {
  return (
    <>
      {markers.map((marker) => {
        // 우리 DB(내 가게)라면 store가 존재
        const isDb = !!marker.store;
        const image = isDb
          ? getDbMarkerImage(marker, selectedTag)
          : require("./src/black.png");
        // 외부 검색 결과는 항상 기본 마커(black.png)
        return zoomLevel >= 18 ? (
          <NaverMapMarkerOverlay
            key={marker.id + zoomLevel}
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
            key={marker.id + zoomLevel}
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
