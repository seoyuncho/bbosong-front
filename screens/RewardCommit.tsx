import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function RewardCommit() {
  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>리워드 받기</Text>
      </View>

      {/* 방문 질문 */}
      <Text style={styles.question}>이 가게를 방문하셨나요?</Text>
      <Text style={styles.shopName}>동대문 삼계탕</Text>

      {/* 카드 */}
      <View style={styles.card}>
        <View style={styles.imageBox} />
        <View style={styles.infoBox}>
          <Text style={styles.title}>동대문 삼계탕</Text>
          <Text style={styles.address}>서울 중구 세종대로 94</Text>
          <Text style={styles.distance}>시청역에서 도보 4분</Text>
          <View style={styles.rewardTag}>
            <Text style={styles.rewardText}>방문 리워드 발울이 3개 ●●●</Text>
          </View>
        </View>
      </View>

      {/* 확인 버튼 */}
      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    alignItems: "center",
    paddingHorizontal: "5%",
    paddingTop: "12%",
  },
  header: {
    width: "100%",
    alignItems: "center",
    marginBottom: "8%",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
  },
  question: {
    fontSize: 16,
    marginBottom: "2%",
  },
  shopName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E6BFF",
    marginBottom: "8%",
  },
  card: {
    flexDirection: "row",
    width: "90%",
    paddingVertical: "3%",
    paddingHorizontal: "4%",
    alignItems: "flex-start",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: "10%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  imageBox: {
    flex: 3,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  infoBox: {
    flex: 7,
    justifyContent: "space-between",
    marginLeft: "4%",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: "2%",
  },
  address: {
    fontSize: 14,
    color: "#555",
    marginBottom: "1%",
  },
  distance: {
    fontSize: 13,
    color: "#2E6BFF",
    marginBottom: "3%",
  },
  rewardTag: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF1FF",
    borderRadius: 12,
    paddingVertical: "1%",
    paddingHorizontal: "3%",
  },
  rewardText: {
    fontSize: 12, 
    color: "#2E6BFF",
  },
  confirmButton: {
    width: "90%",
    paddingVertical: "4%",
    borderRadius: 12,
    backgroundColor: "#2E6BFF",
    alignItems: "center",
  },
  confirmText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
