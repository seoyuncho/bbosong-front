import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import getDbMarkerImage from "./MapMarkers";

// 백엔드 API URL
const API_URL = "https://bbosong-back-production.up.railway.app";

import { Marker } from "../data/sampleMarkers";
export interface PlaceSearchProps {
  mapRef: any;
  onStoresFetched: (markers: Marker[]) => void;
  place?: string;
}

const PlaceSearch = ({
  mapRef,
  onStoresFetched,
  place,
}: PlaceSearchProps): React.JSX.Element => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMarker, setSearchMarker] = useState<any>(null);
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (place) {
      setQuery(place);
      handleSearch(place);
    }
  }, [place]);

  // 외부(네이버 등) 검색만 수행, FlatList에 결과 표시
  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery ?? query;
    if (!q) {
      setSearchResults([]);
      onStoresFetched([]);
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/search-place`, {
        placeName: q,
      });
      console.log("검색 결과:", response.data.places);
      setSearchResults(response.data.places);
      if (response.data.places && response.data.places.length > 0) {
        setSearchResults(response.data.places);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      onStoresFetched([]);
    }
  };

  // FlatList에서 아이템 선택 시: DB 우선 확인, 있으면 DB 정보, 없으면 외부 정보로 마커 표시
  const handlePlaceSelection = async (place: any, idx: number) => {
    // 외부 검색 결과에서 선택된 데이터
    const cleanedTitle = place.title.replace(/<[^>]*>/g, "");
    setQuery(cleanedTitle);
    setSearchResults([]);

    // 1. 우리 DB에 있는지 확인 (부분 일치)
    try {
      const dbRes = await axios.get(
        `${API_URL}/store/search?name=${encodeURIComponent(cleanedTitle)}`
      );
      if (dbRes.data && dbRes.data.length > 0) {
        // DB에 있음: 첫 번째 결과로 마커 생성 및 카테고리별 마커 적용
        const dbPlace = dbRes.data[0];
        const marker: Marker = {
          id: `db-result-${dbPlace.id}`,
          latitude: dbPlace.latitude,
          longitude: dbPlace.longitude,
          caption: dbPlace.name,
          subCaption: dbPlace.address || "",
          description: dbPlace.category || "",
          image: { symbol: "black" }, // 타입 에러 방지용, 실제 이미지는 MapMarkers에서 결정
          store: dbPlace,
        };
        mapRef.current?.animateCameraTo({
          latitude: dbPlace.latitude,
          longitude: dbPlace.longitude,
          zoom: 15,
          duration: 1000,
          easing: "EaseOut",
        });
        onStoresFetched([marker]);
        return;
      }
    } catch (e) {
      // DB 조회 에러는 무시하고 외부 정보로 진행
    }
    // 2. DB에 없으면 외부 정보로 마커 생성
    if (place && place.mapy && place.mapx) {
      const latitude = place.mapy / 1e7;
      const longitude = place.mapx / 1e7;
      mapRef.current?.animateCameraTo({
        latitude,
        longitude,
        zoom: 15,
        duration: 1000,
        easing: "EaseOut",
      });
      onStoresFetched([
        {
          id: `search-result-${idx}`,
          latitude,
          longitude,
          caption: cleanedTitle,
          subCaption: place.address || "",
          description: "",
          image: { symbol: "red" },
          store: undefined,
        },
      ]);
    }
  };

  // FlatList 렌더링 함수
  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      onPress={() => handlePlaceSelection(item, index)}
      style={styles.resultItem}
    >
      <Text style={styles.resultTitle}>
        {item.title.replace(/<[^>]*>/g, "")}
      </Text>
      <Text style={styles.resultAddress}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.searchComponentContainer}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            margin: 4,
            backgroundColor: "white",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("Main")}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={[styles.searchInput, { flex: 1 }]}
            placeholder="지역명, 가게명 검색"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch()}
            onBlur={() => handleSearch()}
            returnKeyType="search"
          />
          <Ionicons
            name="search"
            size={22}
            color="#00000"
            style={{ marginRight: 12 }}
          />
        </View>
      </View>

      {searchResults.length > 0 && (
        <View style={styles.resultsListContainer}>
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.resultsList}
          />
        </View>
      )}

      {/* 검색 결과 임시 마커 오버레이 */}
      {searchMarker && (
        <NaverMapMarkerOverlay
          key={searchMarker.id}
          latitude={searchMarker.latitude}
          longitude={searchMarker.longitude}
          caption={{ text: searchMarker.caption }}
          subCaption={{ text: searchMarker.subCaption }}
          image={{ symbol: "red" }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchComponentContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    zIndex: 10,
    margin: 20,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F8F9",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    color: "#999999",
    alignContent: "center",
  },
  searchInput: {
    flex: 1,
    padding: 12,
    textAlign: "center",
  },
  // searchButton, searchButtonText 제거
  resultsListContainer: {
    marginTop: 45,
    maxHeight: 400,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  resultsList: {
    // FlatList 내부 스타일
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultTitle: {
    fontWeight: "bold",
  },
  resultAddress: {
    color: "#666",
  },
});

export default PlaceSearch;
