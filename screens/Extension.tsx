import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Bubble from "./src/bubble.svg";

const Extension = ({ navigation }: any) => {
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
      <View style={{ flex: 1, width: "100%", paddingTop: 90 }}>
        <Text style={styles.title}>연장을 위해</Text>
        <Text style={styles.title}>비눗방울을 사용할 수 있어요.</Text>
        <View style={styles.bubbles}>
          <Text>보유 중인 비눗방울</Text>
          <Text>비눗방울 3개로 1일(24시간) 연장할 수 있어요.</Text>
        </View>
        <View style={styles.bubbles}>
          <Text>대여 연장 전</Text>
          <Text>반납 시간: 2025.08.18. 오전 9:41</Text>
          <Text>대여 연장 후</Text>
          <Text>반납 시간: 2025.08.19. 오전 9:41</Text>
        </View>
        <View style={styles.bubbles}>
          <Text>연장 후 비눗방울</Text>
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
    padding: 20,
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
    padding: 24,
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Extension;
