import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function RewardComplete() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("RewardCommit" as never)}
        >
          <Icon name="arrow-back" size={wp("6%")} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>리워드 받기</Text>
        <View style={{ width: wp("6%") }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.message}>
          방울이 <Text style={styles.highlight}>3개</Text> 적립되었어요!
        </Text>

        <Image
          source={require("../assets/reward_bubble.jpg")} // 방울 이미지 (투명 배경)
          style={styles.bubbleImage}
          resizeMode="contain"
        />

        <View style={styles.rewardBox}>
            <View style={styles.rewardRow}>
                <Text style={styles.rewardLabel}>보유 중인 방울이</Text>
                <View style={styles.iconRow}>
                    <Image
                        source={require("../assets/bubble.png")}
                        style={styles.rewardIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.rewardValue}>6개</Text>
                </View>
            </View>
          <Text style={styles.subText}>
            비눗방울 3개로 1일(24시간) 연장할 수 있어요.
          </Text>
        </View>
      </View>

      {/* Confirm button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    paddingTop: hp("5%"),
    backgroundColor: "#f0f2fa",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: hp("2%"),
  },
  headerTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  message: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    marginBottom: hp("3%"),
    textAlign: "center",
  },
  highlight: {
    color: "#537BFF",
    fontWeight: "bold",
  },
  bubbleImage: {
    width: wp("60%"),
    height: hp("30%"),
    marginBottom: hp("3%"),
  },
  rewardBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: wp("10%"),
    height: hp("13%"),
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("4%"),
    // alignItems: "flex-start", // 왼쪽 정렬
    marginBottom: hp("1%"),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    },
    rewardRow: {
    flexDirection: "row",
    paddingTop: hp("1%"),
    paddingHorizontal: wp("2%"),
    justifyContent: "space-between", // 🔑 왼쪽-오른쪽 끝 배치
    alignItems: "center",
    },
    iconRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: wp("3%"),
    },
    rewardIcon: {
    marginRight: wp("1%"),
    },
    rewardLabel: {
    fontSize: wp("4.5%"),
    color: "#111",
    fontWeight: "600",
    marginRight: wp("1%"),
    },
    rewardValue: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    color: "#537BFF",
    },
  subText: {
    fontSize: wp("4%"),
    paddingHorizontal: wp("2%"),
    color: "#343434",
    opacity: 0.67,
    textAlign: "left",
    marginTop: hp("1%"),
  },
  button: {
    backgroundColor: "#537BFF",
    borderRadius: wp("5%"),
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    marginBottom: hp("7%"),
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
});
