import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

export default function QRReturnComplete() {
  const navigation = useNavigation();

  return (
    <LinearGradient
        colors={['#FFFFFF', '#CDD7E4', '#A1ACD280']}
        locations={[0, 0.5, 1]}
        style={styles.container}
      >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("QRReturnCommit" as never)}
        >
          <Icon name="arrow-back" size={wp("6%")} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>뽀송이 대여</Text>
        <View style={{ width: wp("5%") }} />
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.stationText}>뽀송 스테이션 시청역점</Text>
        <Text style={styles.completeText}>우산 반납이 완료되었어요.</Text>

        <View style={styles.checkCircle}>
          <Icon name="checkmark-sharp" size={100} color="white" />
        </View>

        <Text style={styles.infoText}>
          사용한 시간: <Text style={styles.highlight}>21시간 35분</Text>
        </Text>
        <Text style={styles.infoText}>
          보증금은 <Text style={styles.highlight}>2~3일</Text> 내에 환불될 예정이에요.
        </Text>
      </View>

      {/* Confirm button */}      
        <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("QRReturnReward" as never)}>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: hp("5%"),
  },
  stationText: {
    fontSize: wp("4.5%"),
    color: "#537BFF",
    marginBottom: hp("1%"),
    textAlign: "center",
    fontWeight: "600",
  },
  completeText: {
    fontSize: wp("6%"),
    fontWeight: "600",
    marginBottom: hp("4%"),
    textAlign: "center",
  },
  checkCircle: {
    width: wp("40%"),
    height: wp("40%"),
    borderRadius: wp("30%"),
    backgroundColor: "#A1ACF2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("10%"),
    marginBottom: hp("15%"),
  },
  infoText: {
    fontSize: wp("5%"),
    textAlign: "center",
    marginBottom: hp("1%"),
    fontWeight: "600",
  },
  highlight: {
    fontWeight: "bold",
    color: "#537BFF",
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
