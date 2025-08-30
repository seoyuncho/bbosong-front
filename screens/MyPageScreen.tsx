import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons'; // 위치 아이콘
import {LinearGradient} from 'expo-linear-gradient';
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const MypageScreen: React.FC = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState("loading...");
  const [distance, setDistance] = useState(0);
  const [email, setEmail] = useState("loading...");
  const [totalRent, setTotalRent] = useState(0);
  const [drops, setDrops] = useState(0);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = 3; // 예시: 실제로는 AsyncStorage 토큰 등에서 가져오기
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        // const decoded: any = jwtDecode(token);
        // const userId = Number(decoded.id);
        // if (isNaN(userId)) throw new Error("Invalid user ID in token");
        const res = await axios.get(`https://bbosong-back-production.up.railway.app/mypage?userId=${userId}`);
        const user = res.data;
        console.log("user:", user);

        setUsername(user.name || "김뽀송");
        setDistance(user.travelDistance ? Number(user.travelDistance.toFixed(2)) : 0);
        setEmail(user.email || "kimposong@example.com");
        setTotalRent(user.rentCount || 0);
        setDrops(user.bubbleCount || 0);

      } catch (err) {
        console.warn("유저 정보 불러오기 실패:", err);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <LinearGradient colors={['#FFFFFF', '#CDD7E4', '#A1ACD280']} style={styles.container}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: wp("5%") }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Main" as never)}>
            <Ionicons name="arrow-back" size={wp("6%")} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>내 정보</Text>
          {/* <TouchableOpacity>
            <Text style={styles.qrText}>점주용 QR</Text>
          </TouchableOpacity> */}
          <View style={{ width: wp("6%") }} />
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <Image
            source={require('./src/user.png')}
            style={styles.avatarImage}
          />
          <View style={styles.userText}>
            <Text style={styles.greeting}>
              안녕하세요, <Text style={styles.username}>{username}</Text>님
            </Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>

        <View style={{ paddingTop: hp("10%") }}>
            {/* 이용내역 제목 */}
            <Text style={styles.sectionTitle}>
              <Text style={styles.username}>{username}</Text> 님의 이용내역
            </Text>

            {/* Stats */}
            <View style={styles.statsSection}>
              {/* 보유 중인 방울 */}
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>보유 중인 방울</Text>
                <View style={styles.iconLabel}>
                  <Image
                    source={require('../assets/bubble.png')}
                    style={[styles.statIcon, { width: wp("4%"), height: wp("4%") }]}
                  />
                  <Text style={styles.statValue}>{drops}개</Text>
                </View>
              </View>

              {/* 대여 횟수 */}
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>대여 횟수</Text>
                <View style={styles.iconLabel}>
                  <Image
                    source={require('../assets/umbrella_icon.png')}
                    style={[styles.statIcon, { width: wp("9%"), height: wp("9%") }]}
                  />
                  <Text style={styles.statValue}>{totalRent}회</Text>
                </View>
              </View>

              {/* 이동 거리 */}
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>이동 거리</Text>
                <View style={styles.iconLabel}>
                  <Ionicons
                    name="location"
                    size={wp("5%")}
                    color="#537BFF"
                  />
                  <Text style={styles.statValue}>{distance} km</Text>
                </View>
              </View>
              <View style={{ height: hp("1%") }} />
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>대여내역</Text>
              </TouchableOpacity>
            </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MypageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F7F9FC",
    // paddingHorizontal: wp("5%"),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginTop: hp("2%"),
    // marginBottom: hp("3%"),
    paddingTop: hp("7%"),
  },
  backText: {
    fontSize: 18,
    color: "#000",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  qrText: {
    fontSize: 16,
    color: "#537BFF",
  },
  userSection: {
    flexDirection: "row",
    paddingTop: hp("5%"),
    alignItems: "center",
    marginBottom: hp("2%"),
  },
  avatarImage: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("10%"),
    backgroundColor: "#FFFFFF",
  },
  userText: {
    marginLeft: wp("4%"),
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  username: {
    fontWeight: "600",
    color: "#537BFF",
  },
  email: {
    fontSize: 16,
    color: "#7A7A7A",
    marginTop: hp("0.5%"),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    paddingBottom: hp("2%"),
    paddingLeft: wp("2%"),
  },
  statsSection: {
    gap: hp("2%"),
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: wp("8%"),
    paddingVertical: hp("3%"),
    paddingHorizontal: wp("4%"),
    height: hp("10%"),
    flexDirection: "row",       // 한 줄 배치
    alignItems: "center",
    justifyContent: "space-between", // 텍스트+값 간 거리 유지
  },
  statLabel: {
    fontSize: 16,
    fontWeight:"600",
    color: "000",
    marginLeft: wp("2%"), // 아이콘과 간격
  },
  statValue: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: "#537BFF",
  },
  iconLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  statIcon: {
    width: wp("5%"),
    height: wp("5%"),
    resizeMode: "contain",
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
