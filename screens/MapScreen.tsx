import React, { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import {
  NaverMapView,
  NaverMapViewRef,
} from "@mj-studio/react-native-naver-map";
import { useLocationPermission } from "../hooks/useLocationPermission";
import PlaceSearch from "../components/PlaceSearch";
import PlaceDetail from "../components/PlaceDetail";
import MapMarkers from "../components/MapMarkers";
import { Marker } from "../data/sampleMarkers";
import HashtagList from "../components/HashtagList";
import axios from "axios";
import { useRoute } from "@react-navigation/native";

const API_URL = "https://bbosong-back-production.up.railway.app";

const MapScreen = (): React.JSX.Element => {
  const { hasPermission } = useLocationPermission();
  const mapRef = useRef<NaverMapViewRef>(null);
  const [allMarkers, setAllMarkers] = useState<Marker[]>([]); // 전체 마커 원본
  const [markers, setMarkers] = useState<Marker[]>([]); // 현재 지도에 표시할 마커
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Marker | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(0);

  // 전체 마커 불러오기 (초기화/해제용)
  const fetchAllMarkers = async () => {
    try {
      console.log("전체 마커를 불러오는 중...");
      console.log(`${API_URL}/store/initialmap`);

      const response = await axios.get(`${API_URL}/store/initialmap`);
      const newMarkers = response.data.map((store: any) => ({
        id: `store-${store.id}`,
        latitude: parseFloat(store.latitude),
        longitude: parseFloat(store.longitude),
        caption: store.name,
        subCaption: store.address ?? "",
        description: store.category ?? "",
        store,
      }));
      setAllMarkers(newMarkers);
      setMarkers(newMarkers);
    } catch (error) {
      console.error("마커 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (hasPermission) {
      fetchAllMarkers();
    }
  }, [hasPermission]);

  // 해시태그 마커 필터링
  const handleHashtagFetched = (filtered: Marker[]) => {
    if (filtered.length > 0) {
      setMarkers(filtered);
    } else {
      setMarkers(allMarkers); // 해시태그 해제 시 전체 마커
    }
  };

  // 검색 결과 마커만 표시
  const handleSearchFetched = (searchMarkers: Marker[]) => {
    if (searchMarkers.length > 0) {
      setMarkers(searchMarkers);
    } else {
      setMarkers(allMarkers); // 검색 해제 시 전체 마커
    }
  };

  const handleMarkerTap = (place: Marker) => {
    // 마커 클릭 시 해당 위치로 카메라 이동
    if (mapRef.current && place.latitude && place.longitude) {
      mapRef.current.animateCameraTo({
        latitude: place.latitude,
        longitude: place.longitude,
        zoom: 15,
        duration: 1000,
        easing: "EaseOut",
      });
    }
    setSelectedPlace(place);
    setIsModalVisible(true);
  };

  // navigation param에서 place 추출
  const route = useRoute<any>();
  const place = route.params?.place;

  if (hasPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>위치 권한을 확인 중입니다...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>위치 권한이 없어 지도를 표시할 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <NaverMapView
        style={{ flex: 1 }}
        isShowLocationButton={true}
        initialRegion={{
          // 37.560013, 126.975180 왼쪽 아래
          // 37.567750, 126.979615 오른쪽 위
          latitude: 37.560013,
          longitude: 126.97518,
          latitudeDelta: 0.0077,
          longitudeDelta: 0.0045,
        }}
        ref={mapRef}
        onCameraChanged={({ zoom }: any) => setZoomLevel(zoom)}
      >
        <MapMarkers
          markers={markers}
          onMarkerTap={handleMarkerTap}
          zoomLevel={zoomLevel}
        />
      </NaverMapView>
      <PlaceSearch
        mapRef={mapRef}
        onStoresFetched={handleSearchFetched}
        place={place}
      />
      <HashtagList
        onStoresFetched={handleHashtagFetched}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
      <PlaceDetail
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        place={selectedPlace}
      />
    </View>
  );
};

export default MapScreen;
