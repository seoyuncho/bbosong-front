import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

// 백엔드 API URL
const API_BASE_URL = 'http://172.30.1.36:3000';

type PlaceSearchProps = {
  onPlaceSelected: (place: any) => void;
};

const PlaceSearch = ({ onPlaceSelected }: PlaceSearchProps): React.JSX.Element => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // 네이버 오픈 API를 호출하는 함수
  const handleSearch = async () => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/search-place`, {
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
    onPlaceSelected({
      title: cleanedTitle,
      address: place.address,
      latitude: place.mapy / 1e7, // 위도 (Naver API에서 1e7로 나누어야 함)
      longitude: place.mapx / 1e7, // 경도 (Naver API에서 1e7로 나누어야 함)
    });
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
          placeholder="장소명을 입력해주세요."
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
    </View>
  );
};

const styles = StyleSheet.create({
  searchComponentContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    padding: 12,
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