import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import Bubble from "./src/bubble.svg";
import Question from "./src/question.svg";

const Extension = ({ navigation }: any) => {
  const [rentStart, setRentStart] = useState<string | null>(null);
  const [rentEnd, setRentEnd] = useState<string | null>(null);

  const [reward, setReward] = useState(0);

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

        // 화면 컴포넌트 안 위쪽에 함수 추가
        const formatDate = (date: Date): string => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");

          let hours = date.getHours();
          const minutes = String(date.getMinutes()).padStart(2, "0");

          const ampm = hours < 12 ? "오전" : "오후";
          hours = hours % 12 || 12; // 0시는 12로 표시

          return `${year}.${month}.${day} ${ampm} ${hours}:${minutes}`;
        };

        if (umbrella) {

          const start = new Date(umbrella.rent_start);
          const end = new Date(umbrella.rent_end);

          setRentStart(formatDate(start));
          end.setTime(end.getTime() + 24 * 60 * 60 * 1000);
          setRentEnd(formatDate(end));
                    
        } // <- if (umbrella) 닫힘

        const res_user = await axios.get(
          `https://bbosong-back-production.up.railway.app/mypage?userId=${userId}`
        );
        const userInfo = res_user.data;
        console.log("userInfo:", userInfo);

        setReward(userInfo.bubbleCount || 0);

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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("BorrowInfo")}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>대여 연장</Text>
      </View>
      <View style={{ flex: 1, width: "100%", paddingTop: 90, gap: 8 }}>
        <View style={{ padding: 20, paddingVertical: 30 }}>
          <Text style={styles.title}>연장을 위해</Text>
          <Text style={styles.title}>방울이를 사용할 수 있어요.</Text>
        </View>
        <View style={styles.bubbles}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, padding: 5 }}>
              보유 중 방울이
            </Text>
            <Bubble />
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#537BFF" }}>{reward}개</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, padding: 5 }}>
            <Question />
            <Text style={{ fontSize: 12, color: "#999999" }}>
              방울이 3개로 1일(24시간) 연장할 수 있어요.
            </Text>
          </View>
        </View>
        <View style={styles.bubbles}>
          <Text style={{ fontWeight: "bold", fontSize: 16, padding: 5 }}>
            대여 연장 전
          </Text>
          <Text style={{ fontSize: 12, color: "#999999", padding: 5 }}>
            반납 시간: {rentStart}
          </Text>
          <View style={{ height: 1, backgroundColor: "#eee", marginVertical: 16, width: "100%" }} />
          <Text style={{ fontWeight: "bold", fontSize: 16, padding: 5 }}>
            대여 연장 후
          </Text>
          <Text style={{ fontSize: 12, color: "#999999", padding: 5 }}>
            반납 시간: {rentEnd}
          </Text>
        </View>
        <View style={styles.bubbles}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, padding: 5 }}>
              연장 후 방울이
            </Text>
            <Bubble />
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#537BFF" }}>3개</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Extension")}
      >
        <Text style={styles.buttonText}>연장하기</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    padding: 8,
  },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    left: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111111",
  },
  subTitle: {
    fontSize: 18,
    color: "#537BFF",
    marginTop: 100,
  },
  code: {
    fontWeight: "600",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111111",
    marginTop: 8,
  },
  infoBoxOverlay: {
    position: "absolute",
    bottom: 90,
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: 500,
    aspectRatio: 1,
    bottom: "10%",
    margin: 30,
  },
  infoText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111111",
  },
  highlight: {
    color: "#537BFF",
  },
  subInfo: {
    marginTop: 6,
    fontSize: 16,
    color: "#111111",
    opacity: 0.7,
  },
  bubbles: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 20,
  },
  button: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    width: "90%",
    height: 46,
    borderRadius: 40,
    backgroundColor: "#537BFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 45,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Extension;
