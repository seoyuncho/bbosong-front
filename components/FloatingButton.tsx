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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const FloatingButton = () => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [time, setTime] = useState("");
  const [isBorrowing, setIsBorrowing] = useState(false);
  const navigation = useNavigation<any>();

  // 현재 시간 갱신
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
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
        const res = await axios.get(`http://10.84.59.115:3000/mypage?userId=${userId}`);
        const user = res.data;
        // umbrella_id가 null이 아니면 대여중
        console.log(user)
        setIsBorrowing(user.umbrella_id !== null);
      } catch (err) {
        console.error("대여 상태 확인 실패:", err);
      }
    };

    fetchBorrowStatus();
  },);

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
          <Text style={styles.text}>{time}</Text>
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
