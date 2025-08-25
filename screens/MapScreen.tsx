import React, { useState, useEffect, useRef } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import {
  NaverMapView,
  NaverMapViewRef,
  NaverMapMarkerOverlay,
  Camera,
} from "@mj-studio/react-native-naver-map";
import { useLocationPermission } from "../hooks/useLocationPermission";
import BackgroundPermission from "../components/BackgroundPermission";
import PlaceSearch from "../components/PlaceSearch";
import PlaceDetail from "../components/PlaceDetail";
import MapMarkers from "../components/MapMarkers";
import { sampleMarkers, Marker } from "../data/sampleMarkers";
import HashtagList from "../components/HashtagList";
import axios from "axios";

const API_URL = "172.30.1.64";

const MapScreen = (): React.JSX.Element => {
  const { hasPermission } = useLocationPermission();
  const mapRef = useRef<NaverMapViewRef>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Marker | null>(null);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await axios.get(`http://${API_URL}/store/initialmap`);
        setMarkers(response.data);
      } catch (error) {
        console.error("마커 불러오기 실패:", error);
      }
    };

    if (hasPermission) {
      fetchMarkers();
    }
  }, [hasPermission]);

  const handleMarkerTap = (place: Marker) => {
    setSelectedPlace(place);
    setIsModalVisible(true);
  };

  const handleStoresFetched = (fetchedStores: any[]) => {
    setMarkers(fetchedStores);
  };

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
          latitude: 37.56070378,
          longitude: 126.9768616,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        ref={mapRef}
      >
        <MapMarkers markers={markers} onMarkerTap={(marker) => console.log('Marker tapped:', marker)} />
      </NaverMapView>
      <PlaceSearch mapRef={mapRef} />
      <HashtagList
        onStoresFetched={handleStoresFetched}
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
