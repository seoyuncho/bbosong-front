import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { NaverMapMarkerOverlay } from '@mj-studio/react-native-naver-map';

// 백엔드 API URL
const API_URL = 'http://10.122.144.49:3000';

type PlaceSearchProps = {
  mapRef: any;
};

const PlaceSearch = ({ mapRef }: PlaceSearchProps): React.JSX.Element => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchMarker, setSearchMarker] = useState<any>(null);
  
  // 네이버 오픈 API를 호출하는 함수
  const handleSearch = async () => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/search-place`, {
        placeName: query,
      });
      setSearchResults(response.data.places);
    } catch (error) {
      console.error('Error searching for place:', error);
    }
  };

  // 검색 결과 아이템을 선택했을 때 실행되는 함수
  const handlePlaceSelection = (place: any) => {
    const cleanedTitle = place.title.replace(/<[^>]*>/g, '');
    setQuery(cleanedTitle); // 검색창에 선택한 장소명 표시
    setSearchResults([]); // 검색 결과 목록 숨기기

    // 지도 이동
    if (place && place.mapy && place.mapx) {
      const latitude = place.mapy / 1e7;
      const longitude = place.mapx / 1e7;
      mapRef.current?.animateCameraTo({
        latitude,
        longitude,
        zoom: 20,
        duration: 1000,
        easing: 'EaseOut',
      });

      // 임시 마커 생성
      setSearchMarker({
        id: 'search-result',
        latitude,
        longitude,
        caption: cleanedTitle,
        subCaption: place.address || '',
      });

      // 10초 후 임시 마커 제거
      setTimeout(() => {
        setSearchMarker(null);
      }, 10000);
    }
  };

  // FlatList 렌더링 함수
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handlePlaceSelection(item)} style={styles.resultItem}>
      <Text style={styles.resultTitle}>{item.title.replace(/<[^>]*>/g, '')}</Text>
      <Text style={styles.resultAddress}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.searchComponentContainer}>
      <View style={styles.searchContainer}>
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
          image={{ symbol: 'red' }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchComponentContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    zIndex: 10,
    margin: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    textAlign: 'center'
  },
  searchButton: {
    padding: 12,
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderColor: '#eee',
  },
  searchButtonText: {
    fontWeight: 'bold',
  },
  resultsListContainer: {
    marginTop: 10,
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  resultsList: {
    // FlatList 내부 스타일
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultTitle: {
    fontWeight: 'bold',
  },
  resultAddress: {
    color: '#666',
  },
});

export default PlaceSearch;