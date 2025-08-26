import React, { useState, useRef } from "react";
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
import Arrow from "./src/arrow.svg";
import { useNavigation } from "@react-navigation/native";

// 백엔드 API URL
const API_URL = "http://192.168.45.96:3000";

import { Marker } from "../data/sampleMarkers";
type PlaceSearchProps = {
  mapRef: any;
  onStoresFetched: (markers: Marker[]) => void;
};

const PlaceSearch = ({
  mapRef,
  onStoresFetched,
}: PlaceSearchProps): React.JSX.Element => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchMarker, setSearchMarker] = useState<any>(null);
  const navigation = useNavigation<any>();

  // 네이버 오픈 API를 호출하는 함수
  const handleSearch = async () => {
    if (!query) {
      setSearchResults([]);
      onStoresFetched([]); // 검색어 없으면 전체 마커로 복구
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/search-place`, {
        placeName: query,
      });
      setSearchResults(response.data.places);

      // 검색 결과를 markers로 가공해서 지도에 표시
      if (response.data.places && response.data.places.length > 0) {
        const markers: Marker[] = response.data.places.map(
          (place: any, idx: number) => {
            const cleanedTitle = place.title.replace(/<[^>]*>/g, "");
            const latitude = place.mapy / 1e7;
            const longitude = place.mapx / 1e7;
            return {
              id: `search-result-${idx}`,
              latitude,
              longitude,
              caption: cleanedTitle,
              subCaption: place.address || "",
              description: "",
              image: undefined,
              store: undefined,
            };
          }
        );
        onStoresFetched(markers);
      } else {
        onStoresFetched([]); // 검색 결과 없으면 전체 마커로 복구
      }
    } catch (error) {
      console.error("Error searching for place:", error);
      onStoresFetched([]); // 에러 시 전체 마커로 복구
    }
  };

  // 검색 결과 아이템을 선택했을 때 실행되는 함수
  const handlePlaceSelection = (place: any, idx: number) => {
    const cleanedTitle = place.title.replace(/<[^>]*>/g, "");
    setQuery(cleanedTitle); // 검색창에 선택한 장소명 표시
    setSearchResults([]); // 검색 결과 목록 숨기기

    if (place && place.mapy && place.mapx) {
      const latitude = place.mapy / 1e7;
      const longitude = place.mapx / 1e7;
      mapRef.current?.animateCameraTo({
        latitude,
        longitude,
        zoom: 20,
        duration: 1000,
        easing: "EaseOut",
      });

      // 선택한 장소만 markers로 표시
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
          style={{ margin: 4, backgroundColor: "white", borderRadius: 50 }}
          onPress={() => {
            navigation.navigate("");
          }}
        >
          <Arrow
            width={40}
            height={40}
            style={{ width: "100%", marginLeft: 4 }}
            onPress={() => {
              navigation.navigate("Main");
            }}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="지역명, 가게명 검색"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
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
    backgroundColor: "white",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    color: "#999999",
  },
  searchInput: {
    flex: 1,
    padding: 12,
    textAlign: "center",
  },
  searchButton: {
    padding: 12,
    justifyContent: "center",
    borderLeftWidth: 1,
    borderColor: "#eee",
  },
  searchButtonText: {
    fontWeight: "bold",
  },
  resultsListContainer: {
    marginTop: 10,
    maxHeight: 200,
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
