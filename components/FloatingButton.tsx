import React, { useRef, useEffect, useState } from "react";
import { Animated, PanResponder, StyleSheet, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const FloatingButton = () => {
  // 시작은 (0,0) → 스타일의 bottom/right 기준으로 위치 결정
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [time, setTime] = useState("");

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

  // 드래그 핸들러
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        // 클릭 vs 드래그 구분 (거의 안 움직였으면 클릭으로 판단)
        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          console.log("버튼 클릭됨!");
          // 👉 여기서 navigation.navigate("MyPage") 같은 로직 실행 가능
        }
        pan.extractOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        { transform: pan.getTranslateTransform() },
      ]}
    >
      <Pressable onPress={() => console.log("버튼 눌림!")}>
        <LinearGradient
          colors={["#537BFF", "#8EC5FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.text}>{time}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,   // ✅ 초기 위치는 여기서 제어
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
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default FloatingButton;
