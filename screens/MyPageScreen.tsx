import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

// 기준 화면 크기 (디자인 기준)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// 비율 계산 함수
export const wp = (size: any) => {
  const screenWidth = Dimensions.get("window").width;
  return (screenWidth / BASE_WIDTH) * Number(size);
};

export const hp = (size: any) => {
  const screenHeight = Dimensions.get("window").height;
  return (screenHeight / BASE_HEIGHT) * Number(size);
};


export default function MyPageScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>안녕하세요, 김뽀송 님</Text>
      {/* 예시로 하단 데이터 */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>보유 중인 방울</Text>
        <Text style={styles.infoValue}>6개</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>대여 횟수</Text>
        <Text style={styles.infoValue}>8회</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>이동 거리</Text>
        <Text style={styles.infoValue}>26 km</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: wp(359),       // 화면 비율에 맞게 width
    height: hp(70),       // 화면 비율에 맞게 height
    paddingVertical: hp(24),
    paddingHorizontal: wp(20),
    flexDirection: "column",
    alignItems: "flex-start",
    gap: hp(16),
    flexShrink: 0,
    backgroundColor: "#fff",  // 필요시 배경색
    borderRadius: wp(12),     // 반경도 비율로
  },
  text: {
    fontSize: wp(16), // 텍스트도 비율 적용
    fontWeight: "bold",
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  infoText: {
    fontSize: wp(14),
    color: "#333",
  },
  infoValue: {
    fontSize: wp(14),
    color: "#4B6AF0", // 예시 색상
  },
});
