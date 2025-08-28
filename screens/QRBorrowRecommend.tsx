import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';


export default function QRBorrowRecommend() {
  const navigation = useNavigation();

  return (
    <LinearGradient
          colors={['#FFFFFF', '#CDD7E4', '#A1ACD280']}
          locations={[0, 0.5, 1]}
          style={styles.container}
      >
      <Text style={styles.smallText}>오늘 같은 날 이런건 어떠신가요?</Text>
      <Text style={styles.title}>오늘 같이 더운 날엔 치맥이지!</Text>

      <Image
        source={require("../assets/bear.png")} // 🐻 맥주잔 이미지
        style={styles.image}
        resizeMode="contain"
      />

      {/* 위치 표시 (아이콘 + 텍스트) */}
      <View style={styles.locationRow}>
        <Icon name="location-sharp" size={18} color="#537BFF" />
        <Text style={styles.locationText}>교촌 치킨 서울 시청역점</Text>
      </View>

      <Text style={styles.desc}>사장님이 뽀송님을 애타게 기다리고 있어요.</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.closeBtn} 
          onPress={() => navigation.navigate("Main" as never)}>
          <Text style={styles.closeText}>닫기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mapBtn}>
          <Text style={styles.mapText}>지도에서 보기</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // 중앙 몰림 해제, 위에서부터 쌓임
    padding: wp("5%"),
    paddingTop: hp("13%"),
    backgroundColor: "#f7f9fc",
  },
  smallText: {
    fontSize: wp("4.5%"),
    color: "#537BFF",
    marginBottom: hp("1%"),
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    marginBottom: hp("3%"),
    textAlign: "center",
  },
  image: {
    width: wp("70%"),   // 기존보다 크게
    height: hp("50%"),  // 화면 세로의 50% 차지
    marginVertical: hp("3%"),
    resizeMode: "contain",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  locationIcon: {
    width: wp("5%"),
    height: wp("5%"),
    marginRight: wp("1.5%"),
  },
  locationText: {
    fontSize: wp("5%"),
    color: "#537BFF",
  },
  desc: {
    fontSize: wp("5%"),
    color: "#333",
    textAlign: "center",
    marginBottom: hp("5%"),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: hp("2%"),
  },
  closeBtn: {
    flex: 0.7,
    backgroundColor: "rgba(142,197,255,0.3)",
    paddingVertical: hp("2%"),
    marginRight: wp("2%"),
    borderRadius: 10,
    alignItems: "center",
  },
  mapBtn: {
    flex: 1.3,
    backgroundColor: "#537BFF",
    paddingVertical: hp("2%"),
    marginLeft: wp("2%"),
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#333",
    fontSize: wp("4.5%"),
  },
  mapText: {
    color: "#fff",
    fontSize: wp("4.5%"),
  },
});
