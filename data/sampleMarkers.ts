export interface Marker {
  id: string;
  latitude: number;
  longitude: number;
  caption: string;
  subCaption: string;
  description: string;
  image: { symbol: string };
  store?: {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    address: string;
    category: string;
    imageUrl?: string;
  };
}

export const sampleMarkers: Marker[] = [
  {
    id: 'marker1',
    latitude: 37.5642573461,
    longitude: 126.9815707967,
    caption: '명동 성당',
    subCaption: '서울 중구 명동2가',
    description: '1898년에 준공된 한국 천주교의 상징적인 성당입니다. 고딕 양식으로 지어져 아름다운 건축미를 자랑합니다.',
    image: { symbol: 'green' },
    store: {
      id: 1,
      latitude: 37.5642573461,
      longitude: 126.9815707967,
      name: '명동 성당',
      address: '서울 중구 명동2가',
      category: '관광',
      imageUrl: 'https://example.com/image1.jpg',
    },
  },
  {
    id: 'marker2',
    latitude: 37.566872,
    longitude: 126.978664,
    caption: '광화문',
    subCaption: '서울 종로구 세종로',
    description: '조선 시대 경복궁의 정문으로, 서울의 상징적인 랜드마크입니다. 주변에 다양한 역사 유적지가 있습니다.',
    image: { symbol: 'blue' },
    store: {
      id: 2,
      latitude: 37.566872,
      longitude: 126.978664,
      name: '광화문',
      address: '서울 종로구 세종로',
      category: '관광',
      imageUrl: 'https://example.com/image2.jpg',
    },
  },
  {
    id: 'marker3',
    latitude: 37.563032,
    longitude: 126.975438,
    caption: '남대문 시장',
    subCaption: '서울 중구 남대문시장',
    description: '서울에서 가장 오래되고 큰 전통시장 중 하나입니다. 다양한 상품과 먹거리가 풍부합니다.',
    image: { symbol: 'yellow' },
    store: {
      id: 3,
      latitude: 37.563032,
      longitude: 126.975438,
      name: '남대문 시장',
      address: '서울 중구 남대문시장',
      category: '관광',
      imageUrl: 'https://example.com/image3.jpg',
    },
  },
];
