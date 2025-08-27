import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

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

        const response = await axios.get(`http://10.84.59.115:3000/qr-scan/umbrella/12`);
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
          onPress={() => navigation.navigate("QRScreen" as never)}
        >
          <Icon name="arrow-back" size={wp("6%")} color="#000" />
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
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
    justifyContent: "space-between",
    paddingBottom: hp("2%"),
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: hp("5%"),
    justifyContent: "space-between",
    width: "100%",
  },
  headerTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: "#111",
    textAlign: "center",
    flex: 1,
  },
  subTitle: {
    fontSize: wp("4.5%"),
    color: "#537BFF",
    marginTop: hp("5%"),
    fontWeight: "600",
    textAlign: "center",
  },
  code: {
    fontWeight: "600",
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "600",
    color: "#111",
    marginTop: hp("1%"),
    textAlign: "center",
  },
  image: {
    width: wp("90%"),
    height: hp("50%"),
    resizeMode: "contain",
    marginTop: hp("3%"),
  },
  infoBoxOverlay: {
    position: "absolute",
    bottom: hp("12%"),
    alignItems: "center",
    width: "100%",
  },
  infoText: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: "#111",
    marginBottom: hp("1%"),
  },
  highlight: {
    color: "#537BFF",
    fontWeight: "600",
  },
  subInfo: {
    fontSize: wp("4%"),
    color: "#343434",
    opacity: 0.7,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#537BFF",
    borderRadius: wp("5%"),
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    marginBottom: hp("5%"),
    width: "90%",
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
});