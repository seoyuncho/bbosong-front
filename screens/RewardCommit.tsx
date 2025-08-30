import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Bubbles from "../components/src/bubbles.svg";

export default function RewardCommit() {
  const navigation = useNavigation();
  const [store, setStore] = useState<any>(null);

  useEffect(() => {
    const loadStore = async () => {
      try {
        const saved = await AsyncStorage.getItem("storeInfo");
        if (saved) {
          setStore(JSON.parse(saved));
          console.log("저장된 가게 정보:", JSON.parse(saved));
        }
      } catch (err) {
        console.error("스토어 불러오기 실패:", err);
      }
    };
    loadStore();
  }, []);

  return (
    <LinearGradient
      colors={["#FFFFFF", "#CDD7E4", "#A1ACD280"]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("QRScreen" as never)}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={18} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>리워드 받기</Text>
        <View style={{ width: wp("6%") }} />
      </View>
      <View style={styles.centerSection}>
        <View style={styles.visitSection}>
          <Text style={styles.question}>이 가게를 방문하셨나요?</Text>
          <View style={styles.shopRow}>
            <Icon name="location-sharp" size={24} color="#537BFF" />
            <Text style={styles.shopName}>{store ? store.name : "가게 이름 불러오는 중..."}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.modalImage} />
          <View style={styles.infoBox}>
            <Text style={styles.title}>{store ? store.name : "가게 이름 불러오는 중..."}</Text>
            <Text style={styles.address}>{store ? store.address : ""}</Text>
            <Text style={styles.distance}>시청역에서 도보 4분</Text>
            <LinearGradient
                colors={["#537BFF", "#8EC5FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  width: "100%",
                  height: 35,
                  borderRadius: 40,
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 14, color: "white" }}>
                  방문 리워드
                </Text>
                <Text
                  style={{ fontSize: 14, color: "white", fontWeight: "bold" }}
                >
                  방울 3개
                </Text>
                <Bubbles />
              </LinearGradient>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => navigation.navigate("RewardComplete" as never)}
      >
        <Text style={styles.confirmText}>확인</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    // paddingTop: hp("2%"),
    // justifyContent: "space-between",
    // paddingBottom: hp("2%"),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp("7%"),
    // padding: hp("5%"),
  },
  backButton: {
    width: wp("6%"),
    alignItems: "flex-start",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  visitSection: {
    alignItems: "center",
    // marginBottom: hp("3%"),
  },
  centerSection: {
    flex: 1,
    paddingTop: hp("10%"),
    justifyContent: "flex-start", // 세로 중앙 정렬
    alignItems: "center", // 가로 중앙 정렬
  },
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: hp("13%"),
    marginTop: hp("1%"),
  },
  question: {
    fontSize: 18,
    // marginBottom: hp("1%"),
    textAlign: "center",
  },
  shopName: {
    fontSize: 25,
    fontWeight: "600",
    color: "#537BFF",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    width: "90%",
    height: hp("23%"),
    alignSelf: "center", // 카드 중앙 배치
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
    alignItems: "center",
    borderRadius: wp("10%"),
    backgroundColor: "#fff",
    marginBottom: hp("10%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  modalImage: {
    backgroundColor: "#f0f0f0",
    width: 100,
    height: "100%",
    borderRadius: 22,
    resizeMode: "cover",
    marginRight: 4,
  },
  infoBox: {
    flex: 7,
    justifyContent: "space-between",
    marginLeft: wp("4%"),
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  address: {
    fontSize: 14,
    color: "#555",
    marginBottom: hp("0.5%"),
  },
  distance: {
    fontSize: 14,
    color: "#537BFF",
    marginBottom: hp("1%"),
  },
  rewardTag: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF1FF",
    borderRadius: wp("3%"),
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("2%"),
  },
  rewardText: {
    fontSize: 12,
    color: "#537BFF",
  },
  confirmButton: {
    backgroundColor: "#537BFF",
    borderRadius: wp("5%"),
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    marginBottom: hp("5.5%"),
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  }
});
