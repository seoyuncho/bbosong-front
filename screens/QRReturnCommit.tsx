import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function QRReturnCommit() {
  const navigation = useNavigation();
  const [stationName, setStationName] = useState('');
  const [rentStart, setRentStart] = useState<Date | null>(null);
  const [rentEnd, setRentEnd] = useState<Date | null>(null);
  const [usedTime, setUsedTime] = useState('');
  const [remainingTime, setRemainingTime] = useState('');
  const [returnTimeText, setReturnTimeText] = useState('')

  

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
          // ✅ station_return_id → station_name 조회
          const stationRes = await axios.get(
            `https://bbosong-back-production.up.railway.app/user-qr/station-name?stationId=${umbrella.station_return_id}`
          );

          setStationName(stationRes.data.stationName);

          // ❌ 여기서 또 setStationName(umbrella.station.name); 쓰면 station 없을 때 에러 → 제거 추천
          // setStationName(umbrella.station.name);

          const start = new Date(umbrella.rent_start);
          const end = new Date(umbrella.rent_end);
          setRentStart(start);
          setRentEnd(end);

          // 사용시간 계산
          const now = new Date();
          const usedMs = now.getTime() - start.getTime();
          const usedHours = Math.floor(usedMs / (1000 * 60 * 60));
          const usedMinutes = Math.floor(
            (usedMs % (1000 * 60 * 60)) / (1000 * 60)
          );
          setUsedTime(`${usedHours}시간 ${usedMinutes}분`);

          // 남은시간 계산
          const remainingMs = end.getTime() - now.getTime();
          if (remainingMs > 0) {
            const remHours = Math.floor(remainingMs / (1000 * 60 * 60));
            const remMinutes = Math.floor(
              (remainingMs % (1000 * 60 * 60)) / (1000 * 60)
            );
            setRemainingTime(`${remHours}시간 ${remMinutes}분 남음`);
          } else {
            setRemainingTime("반납시간 초과");
          }

          // 반납시간 텍스트 계산
          const nowDate = new Date();
          const isToday = end.toDateString() === nowDate.toDateString();
          let dayText: string;
          if (isToday) {
            dayText = "오늘";
          } else {
            const tomorrow = new Date(nowDate);
            tomorrow.setDate(nowDate.getDate() + 1);
            dayText =
              end.toDateString() === tomorrow.toDateString()
                ? "내일"
                : `${end.getMonth() + 1}월 ${end.getDate()}일`; // ✅ 오늘/내일 아니면 날짜
          }

          const hours = end.getHours();
          const minutes = end.getMinutes();
          const ampm = hours < 12 ? "오전" : "오후";
          const displayHour = hours % 12 === 0 ? 12 : hours % 12;
          const displayMinutes = minutes.toString().padStart(2, "0");
          setReturnTimeText(
            `${dayText} ${ampm} ${displayHour}시 ${displayMinutes}분까지`
          );
        } // <- if (umbrella) 닫힘
      } catch (err) {
        console.warn("fetchUmbrellaInfo error:", err);
      }
    };
    fetchUmbrellaInfo();
  }, []);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#CDD7E4', '#A1ACD280']}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={wp("6%")} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>뽀송이 반납</Text>
          <View style={{ width: wp("6%") }} />
        </View>

        {/* 중앙 */}
        <View style={styles.content}>
          <Text style={styles.subTitle}>
            뽀송이 {stationName}
          </Text>
          <Text style={styles.title}>우산을 반납하시겠습니까?</Text>

          {/* 이미지 */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/umbrella_borrow.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* 정보 */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              사용한 시간: <Text style={styles.highlight}>{usedTime}</Text>
            </Text>
            <Text style={styles.infoText}>
              반납시간: <Text style={styles.highlight}>{returnTimeText}</Text>
              </Text>
            <Text style={styles.subInfo}>반납시간까지 {remainingTime}</Text>
          </View>
        </View>

        {/* 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("QRReturnComplete" as never)}
        >
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>
      </View>

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
  },
  highlight: {
    color: "#537BFF",
  },
  subInfo: {
    marginTop: hp("3%"),
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
