import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export default function QRReturnComplete() {
  const navigation = useNavigation();
  const route = useRoute();
  const [stationName, setStationName] = useState("뽀송 스테이션");
  const [rentStart, setRentStart] = useState<Date | null>(null);
  const [usedTime, setUsedTime] = useState("");

  // route.params로 전달받은 station_id가 있으면 백엔드에서 이름 조회
  useEffect(() => {
    const fetchStationName = async () => {
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

          const start = new Date(umbrella.rent_start);
          setRentStart(start);

          // 사용시간 계산
          const now = new Date();
          const usedMs = now.getTime() - start.getTime();
          const usedHours = Math.floor(usedMs / (1000 * 60 * 60));
          const usedMinutes = Math.floor(
            (usedMs % (1000 * 60 * 60)) / (1000 * 60)
          );
          setUsedTime(`${usedHours}시간 ${usedMinutes}분`);
        }

        
      } catch (err) {
        console.warn("stationName fetch error:", err);
      }
    };
    fetchStationName();
  }, [route.params]);

  return (
    <LinearGradient
        colors={['#FFFFFF', '#CDD7E4', '#A1ACD280']}
        locations={[0, 0.5, 1]}
        style={styles.container}
      >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("QRReturnCommit" as never)}
        >
          <Icon name="arrow-back" size={wp("6%")} color="#000" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerTitle}>뽀송이 반납</Text>
        </View>
        <View style={{ width: wp("6%") }} /> {/* 오른쪽 여백 맞춤 */}
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.stationText}>{stationName}</Text>
        <Text style={styles.completeText}>우산 반납이 완료되었어요.</Text>

        <View style={styles.checkCircle}>
          <Icon name="checkmark-sharp" size={100} color="white" />
        </View>

        <Text style={styles.infoText}>
          사용한 시간: <Text style={styles.highlight}>{usedTime}</Text>
        </Text>
        <Text style={styles.infoText}>
          보증금은 <Text style={styles.highlight}>2~3일</Text> 내에 환불될 예정이에요.
        </Text>
      </View>

      {/* Confirm button */}      
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("QRReturnReward" as never)}>
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
    marginBottom: hp("15%"),
  },
  infoText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: hp("1%"),
    fontWeight: "600",
  },
  highlight: {
    fontWeight: "bold",
    color: "#537BFF",
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
