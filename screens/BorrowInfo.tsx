import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BorrowInfo = ({ navigation }: any) => {
  const [stationName, setStationName] = useState("");
  const [rentEnd, setRentEnd] = useState<Date | null>(null);

  useEffect(() => {
    const fetchUmbrellaInfo = async () => {
      try {
        const umbrellaId = await AsyncStorage.getItem("umbrella_id");
        if (!umbrellaId) return;

        const response = await axios.get(
          `http://10.254.205.115:3000/qr-scan/umbrella/${umbrellaId}`
        );
        console.log("borrow response:", response.data);
        const umbrella = response.data.umbrella;
        setStationName(umbrella.station.name);
        setRentEnd(new Date(umbrella.rent_end));
      } catch (err) {
        console.warn("Failed to fetch umbrella info", err);
      }
    };

    fetchUmbrellaInfo();
  }, []);

  // 📌 rent_end 표시 포맷 (내일 오전/오후 hh:mm)
  const rentEndString = rentEnd
    ? `${rentEnd.getHours() < 12 ? "오전" : "오후"} ${
        rentEnd.getHours() % 12 || 12
      }시 ${rentEnd.getMinutes().toString().padStart(2, "0")}분`
    : "...";

  return (
    <LinearGradient
      colors={["#FFFFFF", "#CDD7E4", "#A1ACD280"]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Main")}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>대여 정보</Text>
      </View>

      <View style={{ flex: 1, width: '100%', paddingTop: 10 }}>
        <Text style={styles.title}>현재 뽀송이를 이용 중이에요.</Text>

        <View
          style={{
            width: "80%",
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../assets/umbrella_borrow.png")}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={styles.infoBoxOverlay}>
            <Text style={styles.infoText}>
              사용한 시간: <Text style={styles.highlight}>21시간 35분</Text>
            </Text>
            <Text style={styles.infoText}>
              반납 시간:{" "}
              <Text style={styles.highlight}>오늘 오전 9시 41분까지</Text>
            </Text>
            <Text style={styles.subInfo}>
              반납 시간까지 {rentEndString} 남음
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button1}
        onPress={() => navigation.navigate("Extension")}
      >
        <Text style={styles.buttonText}>반납하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Extension" as never)}
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
    justifyContent: "center",
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
    textAlign: "center",
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
    marginTop: 100,
    textAlign: "center",
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
    textAlign: "left",
  },
  highlight: {
    color: "#537BFF",
  },
  subInfo: {
    marginTop: 6,
    fontSize: 16,
    color: "#111111",
    opacity: 0.7,
    textAlign: "center",
  },
  button1: {
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
    width: "90%",
    height: 46,
    borderRadius: 40,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
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

export default BorrowInfo;
