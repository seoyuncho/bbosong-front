import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function QRReturnCommit() {
  const navigation = useNavigation();
  const [stationName, setStationName] = useState("");
  const [rentStart, setRentStart] = useState<Date | null>(null);
  const [rentEnd, setRentEnd] = useState<Date | null>(null);
  const [usedTime, setUsedTime] = useState("");
  const [remainingTime, setRemainingTime] = useState("");
  const [returnTimeText, setReturnTimeText] = useState("");

  useEffect(() => {
    const fetchUmbrellaInfo = async () => {
      try {
        const getUmbrellaDB = async () => {
          try {
            const jsonValue = await AsyncStorage.getItem("umbrellaDB");
            if (jsonValue !== null) {
              const umbrellaDB = JSON.parse(jsonValue); // ← 원래 객체 복원
              console.log("저장된 umbrellaDB:", umbrellaDB);
              return umbrellaDB;
            }
            return null;
          } catch (error) {
            console.error("umbrellaDB 가져오기 실패:", error);
            return null;
          }
        };
        console.log("umbrellaDB 가져오기 시도");
        const umbrella = await getUmbrellaDB();

        if (umbrella) {
          const start = new Date(umbrella.umbrella.rent_start);
          const end = new Date(umbrella.umbrella.rent_end);
          setRentStart(start);
          setRentEnd(end);
          const usedMs = new Date().getTime() - start.getTime();
          const usedHours = Math.floor(usedMs / (1000 * 60 * 60));
          const usedMinutes = Math.floor(
            (usedMs % (1000 * 60 * 60)) / (1000 * 60)
          );

          const usedTime = `${usedHours}시간 ${usedMinutes}분`;

          // 사용시간 계산
          setUsedTime(usedTime);
          const totalMs = 24 * 60 * 60 * 1000;

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
      colors={["#FFFFFF", "#CDD7E4", "#A1ACD280"]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Main" as never)}
          >
            <Icon name="arrow-back" size={wp("6%")} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>대여정보</Text>
          <View style={{ width: wp("6%") }} />
        </View>

        {/* 중앙 */}
        <View style={styles.content}>
          <Text style={styles.title}>현재 뽀송이를 이용 중이에요.</Text>

          {/* 이미지 */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/umbrella.png")}
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
          </View>
        </View>

        {/* 버튼 */}
        <TouchableOpacity
          style={styles.button2}
          onPress={() => navigation.navigate("QRScanReturn" as never)}
        >
          <Text style={styles.buttonText}>반납하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Extension" as never)}
        >
          <Text style={styles.buttonText}>연장하기</Text>
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
    width: wp("30%"), // 화면 너비의 30% 정도
    height: hp("30%"), // 비율 자동 유지
    aspectRatio: 1, // 정사각형 비율 유지
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
    //paddingTop: hp("1%"), // 100px → 화면 높이 기준
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
    marginTop: hp("1%"),
  },
  infoText: {
    fontSize: wp("5%"), // 20px → 화면 폭 기준
    fontWeight: "600",
    alignSelf: "flex-start",
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
    borderRadius: wp("10%"),
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    marginBottom: hp("5.5%"),
  },
  button2: {
    backgroundColor: "#000",
    borderRadius: wp("10%"),
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    marginBottom: hp("1.5%"),
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
});
