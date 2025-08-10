import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { NaverMapMarkerOverlay, NaverMapView } from '@mj-studio/react-native-naver-map';
import { useLocationPermission } from '../hooks/useLocationPermission';
import BackgroundPermissionModal from '../components/BackgroundPermissionModal';
import PlaceSearch from '../components/PlaceSearch';


// 가상의 마커 데이터
const sampleMarkers = [
  {
    id: 'marker1',
    latitude: 37.5642573461,
    longitude: 126.9815707967,
    caption: '명동 성당',
    subCaption: '서울 중구 명동2가',
    description: '1898년에 준공된 한국 천주교의 상징적인 성당입니다. 고딕 양식으로 지어져 아름다운 건축미를 자랑합니다.',
    image: { symbol: 'green' },
  },
  {
    id: 'marker2',
    latitude: 37.566872,
    longitude: 126.978664,
    caption: '광화문',
    subCaption: '서울 종로구 세종로',
    description: '조선 시대 경복궁의 정문으로, 서울의 상징적인 랜드마크입니다. 주변에 다양한 역사 유적지가 있습니다.',
    image: { symbol: 'blue' },
  },
  {
    id: 'marker3',
    latitude: 37.563032,
    longitude: 126.975438,
    caption: '남대문 시장',
    subCaption: '서울 중구 남대문시장',
    description: '서울에서 가장 오래되고 큰 전통시장 중 하나입니다. 다양한 상품과 먹거리가 풍부합니다.',
    image: { symbol: 'yellow' },
  },
];

// 장소 상세 정보를 보여주는 모달 컴포넌트
const PlaceDetailModal = ({ isVisible, onClose, place }: any) => {
  if (!place) {
    return null; // 장소 정보가 없으면 렌더링하지 않음
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>{place.caption}</Text>
          <Text style={modalStyles.modalSubtitle}>{place.subCaption}</Text>
          <Text style={modalStyles.modalText}>{place.description}</Text>
          <TouchableOpacity
            style={modalStyles.closeButton}
            onPress={onClose}
          >
            <Text style={modalStyles.textStyle}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const MapScreen = (): React.JSX.Element => {
  const { hasPermission } = useLocationPermission();
  type Marker = {
    id: string;
    latitude: number;
    longitude: number;
    caption: string;
    subCaption: string;
    description: string;
    image: { symbol: string };
  };

  const [markers, setMarkers] = useState<Marker[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 가시성 상태
  const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소 정보

  useEffect(() => {
    const fetchMarkers = async () => {
      setMarkers(sampleMarkers);
    };

    if (hasPermission) {
      fetchMarkers();
    }
  }, [hasPermission]);

  // 마커 탭 핸들러 함수
  const handleMarkerTap = (place: any) => {
    setSelectedPlace(place); // 탭한 마커의 장소 정보를 상태에 저장
    setIsModalVisible(true); // 모달을 보이게 설정
  };

  const handlePlaceSelected = (place: any) => {
    // PlaceSearch 컴포넌트에서 선택된 장소 정보를 받아서 처리하는 로직
    console.log('선택된 장소:', place);
    // 예: 지도의 중심을 선택된 장소로 이동시키기
    // mapRef.current?.animateToRegion({ latitude: place.latitude, longitude: place.longitude });
  };

  if (hasPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>위치 권한을 확인 중입니다...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
          longitudeDelta: 0.01
        }}
      >
        {markers.map(marker => (
          <NaverMapMarkerOverlay
            key={marker.id}
            latitude={marker.latitude}
            longitude={marker.longitude}
            onTap={() => handleMarkerTap(marker)} // 마커를 탭하면 핸들러 함수 호출
            caption={{ text: marker.caption }}
            subCaption={{ text: marker.subCaption }}
            //image={marker.image}
          />
        ))}
      </NaverMapView>

      <PlaceSearch onPlaceSelected={handlePlaceSelected} />

      {/* 마커 탭 시 isModalVisible 상태에 따라 PlaceDetailModal을 렌더링 */}
      <PlaceDetailModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        place={selectedPlace}
      />
    </View>
  );
};

// 검색창 관련 스타일
const searchStyles = StyleSheet.create({
  searchContainer: {
    position: 'absolute', // 지도를 침범하지 않고 위에 겹치게 함
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10, // 지도가 아닌 검색창이 터치 이벤트를 받도록 zIndex 설정
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

// 모달 스타일
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MapScreen;