import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const FloatingButton = () => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [remainingTime, setRemainingTime] = useState("");
  const [isBorrowing, setIsBorrowing] = useState(false);
  const navigation = useNavigation<any>();

  // 남은 시간 갱신 (1분마다)
  useEffect(() => {
    const updateRemainingTime = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("umbrellaDB");
        if (jsonValue) {
          const umbrellaDB = JSON.parse(jsonValue);
          const end = new Date(umbrellaDB.umbrella.rent_end);
          const now = new Date();
          let diff = end.getTime() - now.getTime();
          if (diff <= 0) {
            setRemainingTime("반납요망");
          } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            // 시계 형식: 23:57
            const hh = String(hours).padStart(2, "0");
            const mm = String(minutes).padStart(2, "0");
            setRemainingTime(`${hh}:${mm}`);
          }
        } else {
          setRemainingTime("");
        }
      } catch (e) {
        setRemainingTime("");
      }
    };
    updateRemainingTime();
    const timer = setInterval(updateRemainingTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // 대여 여부 체크 (API 호출)
  useEffect(() => {
    const fetchBorrowStatus = async () => {
      try {
        const userId = 3; // 예시: 실제로는 AsyncStorage 토큰 등에서 가져오기
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        // const decoded: any = jwtDecode(token);
        // const userId = Number(decoded.id);
        // if (isNaN(userId)) throw new Error("Invalid user ID in token");
        const res = await axios.get(
          `https://bbosong-back-production.up.railway.app/mypage?userId=${userId}`
        );
        const user = res.data;
        // umbrella_id가 null이 아니면 대여중
        console.log(user);
        setIsBorrowing(user.umbrella_id !== null);
      } catch (err) {
        console.error("대여 상태 확인 실패:", err);
      }
    };

    fetchBorrowStatus();
  });

  // 드래그 핸들러
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gesture) => {
        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          navigation.navigate("BorrowInfo");
        }
        pan.extractOffset();
      },
    })
  ).current;

  // umbrella_id가 null이면 버튼 자체를 안 보이게
  if (!isBorrowing) return null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.container, { transform: pan.getTranslateTransform() }]}
    >
      <Pressable onPress={() => navigation.navigate("BorrowInfo")}>
        <LinearGradient
          colors={["#537BFF", "#8EC5FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.text1}>대여중</Text>
          <Text style={styles.text}>{remainingTime}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    right: 20,
    zIndex: 99,
    elevation: 99,
  },
  gradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text1: {
    color: "white",
    fontSize: 16,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default FloatingButton;
