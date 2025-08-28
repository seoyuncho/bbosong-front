import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import QRScreen from "./QRScreen";

export default function RewardCommit() {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={['#FFFFFF', '#CDD7E4', '#A1ACD280']}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate(QRScreen as never)}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={wp("6%")} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>리워드 받기</Text>
        <View style={{ width: wp("6%") }} /> {/* 오른쪽 빈 공간 */}
      </View>

      {/* 중앙 영역: 방문 질문 + 카드 */}
      <View style={styles.centerSection}>
        {/* 방문 질문 및 가게 이름 */}
        <View style={styles.visitSection}>
          <Text style={styles.question}>이 가게를 방문하셨나요?</Text>
          <View style={styles.shopRow}>
            <Icon
              name="location-sharp"
              size={wp("4%")}
              color="#537BFF"
              style={{ marginRight: wp("1%") }}
            />
            <Text style={styles.shopName}>동대문 삼계탕</Text>
          </View>
        </View>

        {/* 카드 */}
        <View style={styles.card}>
          <View style={styles.imageBox} />
          <View style={styles.infoBox}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>동대문 삼계탕</Text>
            </View>
            <Text style={styles.address}>서울 중구 세종대로 94</Text>
            <Text style={styles.distance}>시청역에서 도보 4분</Text>
            <View style={styles.rewardTag}>
              <Text style={styles.rewardText}>방문 리워드 방울이 3개 ●●●</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 확인 버튼 */}
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
    paddingTop: hp("2%"),
    justifyContent: "space-between",
    paddingBottom: hp("2%"),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp("3%"),
    // padding: hp("5%"),
  },
  backButton: {
    width: wp("6%"),
    alignItems: "flex-start",
  },
  headerText: {
    fontSize: wp("5%"),
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
    alignItems: "center",     // 가로 중앙 정렬
  },
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: hp("13%"),
  },
  question: {
    fontSize: wp("4.5%"),
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  shopName: {
    fontSize: wp("6%"),
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
    borderRadius: wp("3%"),
    backgroundColor: "#fff",
    marginBottom: hp("10%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  imageBox: {
    width: wp("25%"),       // 가로 크기
    height: hp("20%"),      // 세로 크기, 카드보다 크게 설정 가능,
    aspectRatio: 1,
    borderRadius: wp("2%"),
    backgroundColor: "#ccc",
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
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
  address: {
    fontSize: wp("3.5%"),
    color: "#555",
    marginBottom: hp("0.5%"),
  },
  distance: {
    fontSize: wp("3.5%"),
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
    fontSize: wp("3%"),
    color: "#537BFF",
  },
  confirmButton: {
    backgroundColor: "#537BFF",
    borderRadius: wp("5%"),
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    marginBottom: hp("5%"),
  },
  confirmText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
});
