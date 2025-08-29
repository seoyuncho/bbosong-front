import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import {useState, useEffect} from "react";

import {jwtDecode} from 'jwt-decode';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RewardComplete() {
  const navigation = useNavigation();
  const [bubbleCount, setBubbleCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        const token = await AsyncStorage.getItem('token'); 
        if (!token) {
          console.log("No token found");
          return;
        }
        const decoded: any = jwtDecode(token);
        console.log("Decoded JWT:", decoded);      
        //const userId = Number(decoded.id);

        // if (isNaN(userId)) {
        //   throw new Error('Invalid user ID in token');
        // }

        // /mypage API 호출
        const userId = 3;
        const res = await axios.get(`https://bbosong-back-production.up.railway.app/mypage?userId=${userId}`);

        setBubbleCount(res.data.bubbleCount); // bubble_count 상태에 저장
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <LinearGradient
          colors={['#FFFFFF', '#CDD7E4', '#A1ACD280']}
          locations={[0, 0.5, 1]}
          style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("RewardCommit" as never)}
        >
          <Icon name="arrow-back" size={18} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>리워드 받기</Text>
        <View style={{ width: wp("6%") }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.message}>
          방울이 <Text style={styles.highlight}>3개</Text> 적립되었어요!
        </Text>

        <View style={styles.content}>
          {/* 방울 이미지만 정중앙 */}
          <Image
            source={require("../assets/reward_bubble.png")}
            style={styles.bubbleImage}
            resizeMode="contain"
          />
        </View>

        {/* 보유 중인 방울 카드 */}
        <View style={styles.rewardCardContainer}>
          <View style={styles.rewardBox}>
            <View style={styles.rewardRow}>
              <Text style={styles.rewardLabel}>보유 중인 방울이</Text>
              <View style={styles.iconRow}>
                <Image
                  source={require("../assets/bubble.png")}
                  style={styles.rewardIcon}
                  resizeMode="contain"
                />
                <Text style={styles.rewardValue}>{bubbleCount}개</Text>
              </View>
            </View>
            <Text style={styles.subText}>
              비눗방울 3개로 1일(24시간) 연장할 수 있어요.
            </Text>
          </View>
        </View>
      </View>

      {/* Confirm button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={()=>navigation.navigate("Main" as never)}
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
    // paddingTop: hp("7%"),
    // backgroundColor: "#f0f2fa",
    justifyContent: "space-between",
  },
  header: {
    paddingTop: hp("7%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingVertical: hp("3%"),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: hp("10%"),
  },
  message: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: hp("3%"),
    textAlign: "center",
  },
  highlight: {
    color: "#537BFF",
    fontWeight: "bold",
  },
  bubbleImage: {
    width: wp("60%"),
    height: hp("30%"),
    // marginTop: hp("10%"),
  },
  rewardCardContainer: {
    width: "100%",
    paddingTop: hp("13%"),
    paddingBottom: hp("3%"), // 확인 버튼과의 간격
    alignItems: "center",
  },
  rewardBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: wp("10%"),
    height: hp("13%"),
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
    rewardRow: {
    flexDirection: "row",
    paddingTop: hp("1%"),
    paddingHorizontal: wp("2%"),
    justifyContent: "space-between", // 🔑 왼쪽-오른쪽 끝 배치
    alignItems: "center",
    },
    iconRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: wp("3%"),
    },
    rewardIcon: {
    marginRight: wp("1%"),
    },
    rewardLabel: {
    fontSize: 18,
    color: "#111",
    fontWeight: "600",
    marginRight: wp("1%"),
    },
    rewardValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#537BFF",
    },
  subText: {
    fontSize: 15,
    paddingHorizontal: wp("2%"),
    color: "#343434",
    opacity: 0.67,
    textAlign: "left",
    marginTop: hp("1%"),
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
    fontSize: 16,
    fontWeight: "600",
  },
});
