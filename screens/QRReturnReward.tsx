import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

export default function QRReturnReward() {
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
          onPress={() => navigation.navigate("QRReturnComplete" as never)}
          >
          <Icon name="arrow-back" size={wp("6%")} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>뽀송이 대여</Text>
        <View style={{ width: wp("5%") }} />
      </View>

      {/* 메인 콘텐츠 */}
      <View style={styles.content}>
        <Text style={styles.username}>뽀송님은</Text>
        <Text style={styles.message}>지금까지 사과만큼 탄소를 줄였어요!</Text>

        <Image
          source={require("../assets/reward_apple.png")}
          style={styles.appleImage}
          resizeMode="contain"
        />

        <View style={styles.stats}>
          <Text style={styles.statText}>
            이동한 거리: <Text style={styles.statValue}>10 km</Text>
          </Text>
          <Text style={styles.statText}>
            총 대여 횟수: <Text style={styles.statValue}>8회</Text>
          </Text>
          <Text style={styles.statText}>
            방울이: <Text style={styles.statValue}>1개</Text>
          </Text>
        </View>

        <Text style={styles.subMessage}>
          앞으로도 뽀송이와 함께 탄소를 줄여나가요.
        </Text>
      </View>

      {/* 확인 버튼 */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate("Main" as never)}>
        <Text style={styles.buttonText}>확인</Text>
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
    paddingTop: hp("5%"),
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: hp("7%"),
  },
  username: {
    fontSize: wp("4.5%"),
    color: "#537BFF",
    fontWeight: "600",
    marginBottom: hp("1%"),
  },
  message: {
    fontSize: wp("5.5%"),
    fontWeight: "600",
    textAlign: "center",
  },
  appleImage: {
    width: wp("40%"),    // 화면 너비 기준 28%
    maxWidth: wp("50%"),
    height: hp("38%"), 
    aspectRatio: 1,

  },
  stats: {
    alignItems: "flex-start",
    paddingBottom: hp("2%"),
  },
  statText: {
    fontSize: wp("5%"),
    marginVertical: hp("0.5%"),
  },
  statValue: {
    color: "#537BFF",
    fontWeight: "bold",
  },
  subMessage: {
    fontSize: wp("4.5%"),
    color: '#343434',
    opacity: 0.67,
    textAlign: "center",
    paddingTop: hp("1%"),
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
