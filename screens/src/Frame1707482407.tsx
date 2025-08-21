import * as React from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import Frame1707482142 from "./Frame1707482142";
import Frame1707482143 from "./Frame1707482143";
import Frame1707482406 from "./Frame1707482406";

const Frame1707482407 = () => {
  return (
    <View style={styles.container}>
      {/* 로고와 오늘 날씨 */}
      <View style={styles.logoWeather}>
        <Image
          source={require("./bbosong.png")}
          style={styles.logo}
        />
        <Text style={styles.weather}>오늘 날씨: 맑음</Text>
      </View>
      {/* QR찍기 */}
      <View style={styles.frameBox}>
        <Frame1707482143 />
      </View>
      {/* 지도보기 */}
      <View style={styles.frameBox}>
        <Frame1707482142 />
      </View>
      {/* 내 정보 */}
      <View style={styles.frameBox}>
        <Frame1707482406 />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 24,
    justifyContent: "flex-start",
  },
  logoWeather: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
    resizeMode: "contain",
  },
  weather: {
    fontSize: 16,
    color: "#333",
  },
  frameBox: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
});

export default Frame1707482407;
