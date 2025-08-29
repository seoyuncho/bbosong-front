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
      <FloatingButton />
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
          <Ellipse width={64} height={64} />
          <View style={{ padding: 10, marginLeft: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#537BFF" }}>
              김뽀송<Text style={{ fontSize: 16, fontWeight: "600", color: "#000000" }}> 님</Text>
            </Text>
            <Text>리워드 내용</Text>
          </View>
          </View>
          <View>
            <TouchableOpacity style={{ borderRadius: 20, backgroundColor: "#FFFFFF"}}>
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
