import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function QRBorrowCommit() {
  const navigation = useNavigation();
  const [stationName, setStationName] = useState('');
  const [rentEnd, setRentEnd] = useState<Date | null>(null);

  useEffect(() => {
    const fetchUmbrellaInfo = async () => {
      try {
        const umbrellaId = await AsyncStorage.getItem('umbrella_id');
        if (!umbrellaId) return;

        const response = await axios.get(`http://10.254.205.115:3000/qr-scan/umbrella/${umbrellaId}`);
        console.log("borrow response:", response.data);
        const umbrella = response.data.umbrella;
        setStationName(umbrella.station.name);
        setRentEnd(new Date(umbrella.rent_end));
      } catch (err) {
        console.warn('Failed to fetch umbrella info', err);
      }
    };

    fetchUmbrellaInfo();
  }, []);

  // 📌 rent_end 표시 포맷 (내일 오전/오후 hh:mm)
  const rentEndString = rentEnd
    ? `${rentEnd.getHours() < 12 ? "오전" : "오후"} ${rentEnd.getHours() % 12 || 12}시 ${rentEnd.getMinutes().toString().padStart(2, "0")}분`
    : "...";

  return (
    <LinearGradient
      colors={['#FFFFFF', '#CDD7E4', '#A1ACD280']}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      {/* 상단 네비게이션 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate("QRScreen" as never)}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>뽀송이 대여</Text>
      </View>

      {/* 텍스트 */}
      <Text style={styles.subTitle}>
        뽀송이 <Text style={styles.code}>스테이션 {stationName}</Text>
      </Text>
      <Text style={styles.title}>우산을 대여하시겠습니까?</Text>

      <View style={{ width: '90%', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <Image
          source={require('../assets/umbrella_borrow.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.infoBoxOverlay}>
          <Text style={styles.infoText}>
            대여 시간: <Text style={styles.highlight}>하루 (24시간)</Text>
          </Text>
          <Text style={styles.subInfo}>
            내일 {rentEndString}까지 반납해야 해요.
          </Text>
        </View>
      </View>

      {/* 하단 버튼 */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate("QRBorrowComplete" as never)}
      >
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111111',
  },
  subTitle: {
    fontSize: 18,
    color: '#537BFF',
    marginTop: 100,
  },
  code: {
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 8,
  },
  infoBoxOverlay: {
    position: 'absolute',
    bottom: 90,
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: 500,
    aspectRatio: 1,
    bottom: '10%',
  },
  infoText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111111',
  },
  highlight: {
    color: '#537BFF',
  },
  subInfo: {
    marginTop: 6,
    fontSize: 16,
    color: '#111111',
    opacity: 0.7,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: '90%',
    height: 46,
    borderRadius: 40,
    backgroundColor: '#537BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
