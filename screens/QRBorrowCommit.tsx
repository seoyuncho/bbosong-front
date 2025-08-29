import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import axios from 'axios';

export default function QRBorrowCommit() {
  const navigation = useNavigation();
  const [stationName, setStationName] = useState('');
  const [rentEnd, setRentEnd] = useState<Date | null>(null);

  useEffect(() => {
    const fetchUmbrellaInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        // const decoded: any = jwtDecode(token);
        // const userId = Number(decoded.id);
        // if (isNaN(userId)) throw new Error("Invalid user ID in token");
        const userId = 3;

        // API 호출
        const res = await axios.get(
          `https://bbosong-back-production.up.railway.app/user-qr/my-umbrella?userId=${userId}`
        );
        const umbrella = res.data.umbrella;
        console.log("umbrella:", umbrella);

        if (umbrella) {
          // ✅ station_borrow_id → station_name 조회
          const stationRes = await axios.get(
            `https://bbosong-back-production.up.railway.app/user-qr/station-name?stationId=${umbrella.station_borrow_id}`
          );

          setStationName(stationRes.data.stationName);

          // ❌ 여기서 또 setStationName(umbrella.station.name); 쓰면 station 없을 때 에러 → 제거 추천
          // setStationName(umbrella.station.name);

          const end = new Date(umbrella.rent_end);
          setRentEnd(end);
        }
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={wp("6%")} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>뽀송이 대여</Text>
        <View style={{ width: wp("6%") }} />
      </View>

      <View style={styles.content}>
        {/* 텍스트 */}
      <Text style={styles.subTitle}>
        뽀송이 스테이션 {stationName}
      </Text>
      <Text style={styles.title}>우산을 대여하시겠습니까?</Text>
        {/* 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/umbrella_borrow.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.infoBox}>
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
        onPress={() => navigation.navigate("QRBorrowPay" as never)}
      >
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp("2%"),
    // paddingTop: hp("2%"),
    // paddingBottom: hp("2%"),
    // justifyContent: "space-between", // 위-중앙-아래 배치
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp("2%"), // 위아래 여백 살짝만
  },
  image: {
    width: wp("70%"),   // 화면 너비의 70% 정도
    height: hp("50%"),  // 비율 자동 유지
    aspectRatio: 1,     // 정사각형 비율 유지
    resizeMode: "contain",
  },
  infoBox: {
    marginTop: hp("1%"),
    // alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: hp("7%"),
    // paddingBottom: hp("2%"),
  },
  headerTitle: {
    fontSize: 18, // 요청하신 글씨 크기
    fontWeight: "600",
  },
  subTitle: {
    textAlign: "center",
    fontSize: 18,
    color: "#537BFF",
    fontWeight: "600",
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
    marginTop: hp("1%"),
  },
  infoText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111111",
    marginTop: hp("1%"),
    textAlign: "center",
  },
  highlight: {
    color: "#537BFF",
  },
  subInfo: {
    marginTop: hp("1%"),
    fontSize: 16,
    color: "#343434",
    opacity: 0.67,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#537BFF",
    borderRadius: wp("5%"),
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    marginBottom: hp("5.5%"),
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
});
