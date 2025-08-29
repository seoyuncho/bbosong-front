import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Frame1707482143 from "./src/Frame1707482143";
import MapCard from "./src/MapCard";
import Ellipse from "./src/ellipse-11.svg";
import Dots from "./src/dots.svg";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "./src/bbosong.svg";
import FloatingButton from "../components/FloatingButton";
import Reward from "./src/reward.svg";
import Weather from "../components/Weather";
import axios from "axios";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Bubble from "./src/bubble.svg";

const MainScreen = ({ navigation }: any) => {
  const [showButton, setShowButton] = useState(false);
  const [username, setUsername] = useState("김뽀송");
  const [bubbleCount, setBubbleCount] = useState<number>(0);

  useEffect(() => {
    const fetchUmbrellaStatus = async () => {
      try {
        // // 토큰 or userId 가져오기
        // const token = await AsyncStorage.getItem("token");
        // if (!token) return;

        // const userId = JSON.parse(token).id; // jwtDecode 써도 됨
        const userId = 3;
        const res = await axios.get(
          `https://bbosong-back-production.up.railway.app/mypage?userId=${userId}`
        );

        // 유저 이름 세팅

        setUsername(res.data.name || "김뽀송");
        setBubbleCount(res.data.bubbleCount || 0);

        // ✅ 캐시 삭제 + 로그 확인
        const clearUmbrellaDB = async () => {
          try {
            await AsyncStorage.removeItem("umbrellaDB");
            console.log("umbrellaDB 캐시 삭제 완료 ✅");

            // 삭제 후 값 확인 (null이어야 정상)
            const check = await AsyncStorage.getItem("umbrellaDB");
            console.log("삭제 후 umbrellaDB:", check);
          } catch (error) {
            console.error("umbrellaDB 캐시 삭제 실패 ❌:", error);
          }
        };

        // umbrella_id 확인
        if (res.data.umbrellaId == null) {
          setShowButton(false);
          clearUmbrellaDB();
        } else {
          setShowButton(true);
        }
      } catch (err) {
        console.error("마이페이지 조회 실패:", err);
      }
    };

    fetchUmbrellaStatus();
  }, []);
  return (
    <LinearGradient
      colors={["#ffffff", "#CDD7E4", "#A1ACD2"]}
      style={{
        flex: 1,
        padding: 8,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {showButton && <FloatingButton />}
      <View
        style={{
          flex: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon style={{ marginTop: 40 }} />
        <View style={{ marginTop: 20, elevation: 7, borderRadius: 19 }}>
          <Weather />
        </View>
      </View>
      <View
        style={{
          flex: 6,
          width: "100%",
          backgroundColor: "white",
          borderRadius: 36,
          padding: 4,
          elevation: 7,
          gap: 0,
          overflow: "hidden",
        }}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Frame1707482143 />
          <MapCard />
        </View>
      </View>
      <View
        style={{
          width: "100%",
          flex: 2,
          elevation: 7,
          borderRadius: 33,
          backgroundColor: "#EBEDF5",
          paddingVertical: 18,
          paddingHorizontal: 20,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 10,
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <View style={{ backgroundColor: "#FFFFFF", borderRadius: 32 }}>
              <Image source={require("./src/user.png")} style={{ width: 64, height: 64, borderRadius: 32 }} />
            </View>
            <View
              style={{ padding: 4, marginLeft: 10, flexDirection: "column", gap: 4 }}
            >
              <>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#537BFF" }}>
                  {username}
                  <Text style={{
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#000000",
                    }}>
                    {" "}
                    님
                  </Text>
                </Text>
              </>
              <>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#537BFF",
                    marginTop: 2,
                    alignContent: "center",
                  }}
                ><Bubble />
                    {" "} 방울 {bubbleCount}개
                </Text>
              </>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={{ borderRadius: 20, backgroundColor: "#FFFFFF" }}
              onPress={() => navigation.navigate("QRScanReward" as never)}
            >
              <Reward />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: "100%",
            backgroundColor: "#111",
            paddingVertical: 15,
            borderRadius: 50,
          }}
          onPress={() => {
            navigation.navigate("MyPage");
          }}
        >
          <Text
            style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}
          >
            내정보
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  textTypo: {
    textAlign: "right",
    fontFamily: "Pretendard",
    fontWeight: "500",
    fontSize: 12,
  },
  view: {
    shadowColor: "rgba(153, 153, 153, 0.2)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 10,
    elevation: 7,
    shadowOpacity: 1,
    borderRadius: 19,
    width: "100%",
    height: 33,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 4,
    gap: 8,
  },
});

export default MainScreen;
