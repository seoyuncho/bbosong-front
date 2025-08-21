import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Frame1707482143 from "./src/Frame1707482143";
import MapCard from "./src/Frame1707482142";
import Ellipse from "./src/ellipse-11.svg";
import Frame1707482406 from "./src/Frame1707482406";
import Dots from "./src/dots.svg";
import { LinearGradient } from "expo-linear-gradient";

const MainScreen = ({ navigation }: any) => {
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
      <View
        style={{
          flex: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("./src/bbosong.png")}
          style={{ width: 59, height: 31, marginTop: 20 }}
        />
        <View style={{ margin: 10, elevation: 7, borderRadius: 19 }}>
          <View style={[styles.view, { backgroundColor: "white" }]}>
            <Text style={[{ color: "#999" }, styles.textTypo]}>오늘 날씨</Text>
            <Text style={[{ color: "#537bff" }, styles.textTypo]}>맑음</Text>
          </View>
        </View>
        <Dots style={{ marginRight: 10 }} />
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
        }}
      >
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <Frame1707482143 />
          <MapCard />
        </View>
      </View>
      <View
        style={{
          width: "100%",
          flex: 2,
          alignItems: "center",
          justifyContent: "center",
          elevation: 7,
          borderRadius: 33,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 30,
            backgroundColor: "rgba(255, 255, 255, 0)",
          }}
        >
          <Ellipse width={64} height={64} />
          <View style={{ padding: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#537BFF" }}>
              김뽀송
            </Text>
            <Text>리워드 내용</Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#111",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
            }}
            onPress={() => {
              navigation.navigate("MyPage");
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>내정보</Text>
          </TouchableOpacity>
        </View>
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
