import React, { useState } from "react"; 
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const PaymentScreen: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<"card" | "naver" | "kakao" | "toss" | "etc">("card");
  const navigation = useNavigation();
  const [stationName, setStationName] = useState<string>("");
  const [stationAddress, setStationAddress] = useState<string>("");
  const [rentEnd, setRentEnd] = useState<Date | null>(null);


  const PaymentOption = ({
    label,
    value,
  }: {
    label: string;
    value: "card" | "naver" | "kakao" | "toss" | "etc";
  }) => (
    <TouchableOpacity
      style={styles.paymentOption}
      onPress={() => setSelectedPayment(value)}
    >
      <View style={styles.bulletOuter}>
        {selectedPayment === value && <View style={styles.bulletInner} />}
      </View>
      <Text style={styles.paymentText}>{label}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchUmbrellaInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        // const decoded: any = jwtDecode(token);
        // const userId = Number(decoded.id);
        // if (isNaN(userId)) throw new Error("Invalid user ID in token");
        const userId = 3;

        // API 호출
        const res = await axios.get(
          `https://bbosong-back-production.up.railway.app/user-qr/my-umbrella?userId=${userId}`
        );
        const umbrella = res.data.umbrella;
        console.log("umbrella:", umbrella);

        if (umbrella) {
          // ✅ station_borrow_id → station_name 조회
          const stationRes = await axios.get(
            `https://bbosong-back-production.up.railway.app/user-qr/station-name?stationId=${umbrella.station_borrow_id}`
          );

          setStationName(stationRes.data.stationName);
          setStationAddress(stationRes.data.stationAddress);

        }
      } catch (err) {
        console.warn('Failed to fetch umbrella info', err);
      }
    };

    fetchUmbrellaInfo();
  }, []);

  return (
   <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F6FA" }}>
    {/* Header - 고정 */}
    <View style={styles.headerContainer}>
        <Text style={styles.headerText}>뽀송이 대여</Text>
    </View>

    {/* Scrollable Content */}
    <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: wp("5%"),  paddingBottom: hp("5%") }}
    >
        {/* 섹션들 */}
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>대여하는 스테이션</Text>
        <Text style={styles.stationName}>뽀송 스테이션 {stationName}</Text>
        <Text style={styles.stationAddress}>{stationAddress}</Text>
        </View>

        <View style={styles.section}>
        <Text style={styles.sectionTitle}>반납하는 스테이션</Text>
        <Text style={styles.stationAddress}>
            근처 <Text style={styles.linkText}>뽀송 스테이션</Text> 어디서든 반납할 수 있어요!
        </Text>
        </View>

        {/* 결제 금액, 결제 수단, 버튼 등 동일 */}
        {/* 결제 금액 */} 
        <View style={styles.section}> 
            <Text style={styles.sectionTitle}>결제 금액</Text> 
            <Text style={styles.depositText}>보증금 20,000원</Text> 
            <Text style={styles.depositInfo}> 보증금은 대여 시간 내에 반납 시 100% 돌려받아요. {"\n"}대여 시간 내에 미반납 시 보증금에서 연체 비용이 차감돼요. </Text> 
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>결제수단</Text>
          <PaymentOption label="신용/체크카드" value="card" />
          <PaymentOption label="토스" value="toss" />
          <PaymentOption label="카카오페이" value="kakao" />
          <PaymentOption label="네이버페이" value="naver" />
          <PaymentOption label="기타 결제수단" value="etc" />
          {selectedPayment === "card" && (
            <TouchableOpacity style={styles.addCard}>
              <Text style={styles.addCardText}>카드 추가 +</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <View style={styles.paddingContainer}>
        {/* 결제 버튼 */}
        <TouchableOpacity style={styles.payButton}
            onPress={() => navigation.navigate("QRBorrowComplete" as never)}
        >
          <Text style={styles.payButtonText}>20,000원 결제</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    backgroundColor: "#F5F6FA",
  },
  headerContainer: {
    paddingTop: hp("7%"),
    justifyContent: "center", // 헤더 아래 간격
    paddingBottom: hp("2%"),
    },
  contentContainer: {
    paddingTop: hp("20%"), // 본문 시작 위치를 아래로
    paddingBottom: hp("7%"),
    },
  header: {
    justifyContent: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: wp("3%"),
    padding: wp("4%"),
    marginTop: hp("2%"),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: hp("0.5%"),
  },
  stationName: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: hp("0.5%"),
  },
  stationAddress: {
    fontSize: 14,
    color: "#7A7A7A",
  },
  linkText: {
    color: "#537BFF",
  },
  depositText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#537BFF",
    marginBottom: hp("0.5%"),
  },
  depositInfo: {
    fontSize: 14,
    color: "#7A7A7A",
    marginTop: hp("0.5%"),
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("1%"),
    marginTop: hp("1%"),
  },
  bulletOuter: {
    width: wp("5%"),
    height: wp("5%"),
    borderRadius: wp("2.5%"),
    borderWidth: 2,
    borderColor: "#537BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp("3%"),
  },
  bulletInner: {
    width: wp("2.5%"),
    height: wp("2.5%"),
    borderRadius: wp("1.25%"),
    backgroundColor: "#537BFF",
  },
  paymentText: {
    fontSize: 14,
    fontWeight: "500",
  },
  addCard: {
    backgroundColor: "#F0F0F0",
    padding: wp("4%"),
    borderRadius: wp("3%"),
    marginTop: hp("1%"),
    alignItems: "center",
  },
  addCardText: {
    fontSize: 14,
    color: "#537BFF",
    fontWeight: "500",
  },
  paddingContainer: {
    paddingTop: hp("1%"),
    paddingBottom: hp("5%"),  
    paddingHorizontal: wp("5%"), 
  },
  payButton: {
    backgroundColor: "#000",
    borderRadius: wp("3%"),
    height: hp("6%"),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("3%"),
    marginBottom: hp("2%"),
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default PaymentScreen;
