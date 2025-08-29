import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import axios from 'axios';

export default function QRBorrowComplete() {
  const navigation = useNavigation();
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
          const end = new Date(umbrella.rent_end);
          setRentEnd(end);
        }
      } catch (err) {
        console.warn("Failed to fetch umbrella info", err);
      }
    };

    fetchUmbrellaInfo();
  }, []);

  // 시간 포맷팅 (오전/오후)
  const rentEndString = rentEnd
    ? (() => {
        const hours = rentEnd.getHours();
        const minutes = rentEnd.getMinutes().toString().padStart(2, "0");
        const period = hours < 12 ? "오전" : "오후";
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
        return `내일 ${period} ${displayHours}시 ${minutes}분`;
      })()
    : "...";

  return (
    <LinearGradient
      colors={['#FFFFFF', '#CDD7E4', '#A1ACD280']}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("QRScreen" as never)}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>뽀송이 대여</Text>
        <View style={{ width: 24 }} /> {/* 오른쪽 여백 */}
      </View>

      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        {/* 결제 완료 텍스트 */}
        <Text style={styles.stationText}>
          보증금 20,000원 결제 완료
        </Text>
        {/* 완료 메시지 */}
        <Text style={styles.completeText}>우산 대여가 완료되었어요.</Text>

        {/* 체크 아이콘 */}
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark-sharp" size={100} color="white" />
        </View>
        <View style={{ alignItems: "flex-start"}}>
          <Text style={styles.infoText}>
            대여 시간: <Text style={styles.highlight}>하루 (24시간)</Text>
          </Text>
          <Text style={styles.infoText}>
            반납 시간: <Text style={styles.highlight}>{rentEndString}까지</Text>
          </Text>
        </View>

        {/* 안내 문구 */}
        <Text style={styles.noticeText}>
          대여 시간 내에 미반납 시 보증금에서 {'\n'}
          연체 비용이 차감돼요.
        </Text>
      </View>

      {/* 하단 버튼 */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("QRBorrowRecommend" as never)}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    // paddingTop: hp("2%"),
    // justifyContent: "space-between",
    // paddingBottom: hp("2%"),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: hp("7%"),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  stationText: {
    textAlign: "center",
    fontSize: 18,
    color: "#537BFF",
    fontWeight: "600",
    marginBottom: hp("1%"),
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: hp("5%"),
  },
  completeText: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: hp("4%"),
    textAlign: "center",
  },
  checkCircle: {
    width: wp("40%"),
    height: wp("40%"),
    borderRadius: wp("20%"),
    backgroundColor: "#A1ACF2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("10%"),
    marginBottom: hp("10%"),
  },
  infoText: {
    fontSize: 18,
    // textAlign: "left",        // ← 왼쪽 정렬
    // width: wp("80%"), 
    marginBottom: hp("1%"),
    fontWeight: "600",
  },
  highlight: {
    fontWeight: "bold",
    color: "#537BFF",
  },
  noticeText: {
    fontSize: 16,
    color: "#343434",
    opacity: 0.67,
    textAlign: "center",
    marginTop: hp("2%"),
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