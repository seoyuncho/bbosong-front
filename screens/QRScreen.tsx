// import React from 'react';
// import { View, Text } from 'react-native';

// const QRScreen = () => (
//   <View>
//     <Text>QR Screen</Text>
//   </View>
// );

// export default QRScreen;

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

export default function QRScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient
        colors={['#FFFFFF', '#CDD7E4', '#A1ACD280']}
        locations={[0, 0.5, 1]}
        style={styles.container}
    >
        {/* 헤더 */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate("Main" as never)}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>QR 찍기</Text>
            <View style={{ width: 24 }} /> 
        </View>

        {/* 카드 영역 */}
        <TouchableOpacity style={styles.card} 
            onPress={() => navigation.navigate("QRScanBorrow" as never)}
            //onPress={() => navigation.navigate("QRBorrowRecommend"  as never)}
            // onPress={()=>navigation.navigate("QRBorrowCommit" as never)}
          >
            <View>
            <Text style={styles.cardTitle}><Text style={styles.blue}>뽀송이</Text> 대여</Text>
            <Text style={styles.cardSubtitle}>우산을 대여해요</Text>
            </View>
            <View style={styles.imageWrapper}>
            <Image source={require("../assets/umbrella_borrow.png")} 
                style={[styles.image, styles.imageBorrow]} />
            </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} 
          onPress={() => navigation.navigate("QRScanReturn" as never)}
          //onPress={()=>navigation.navigate("QRReturnReward" as never)}
          >
            <View>
            <Text style={styles.cardTitle}><Text style={styles.blue}>뽀송이</Text> 반납</Text>
            <Text style={styles.cardSubtitle}>우산을 반납해요</Text>
            </View>
            <View style={styles.imageWrapper}>
                <Image source={require("../assets/umbrella_return.png")} 
                    style={[styles.image, styles.imageReturn]} />
            </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate("QRScanReward" as never)}
          // onPress={() => navigation.navigate("RewardComplete" as never) }
        >
            <View>
            <Text style={[styles.cardTitle, styles.blue]}>리워드 받기</Text>
            <Text style={styles.cardSubtitle}>가게에서 리워드를 받아요</Text>
            </View>
            {/* 임시 아이콘 (이미지 없으니 대체) */}
            {/* <Ionicons name="gift-outline" size={48} color="#537BFF" /> */}
        </TouchableOpacity>
    </LinearGradient>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  header: {
    paddingTop: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  card: {
    top: 100,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",   // ✅ 세로 중앙 정렬 유지
    padding: 20,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    height: 130, // 카드 높이 고정
    overflow: "hidden", // 자식 요소가 카드 영역을 벗어나지 않도록
    },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 16,
    color: "#555",
  },
  blue: {
    color: "#537BFF",
  },
  imageWrapper: {
    width: 120,     // 카드 내 이미지 영역 고정
    height: "100%", 
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,     // ✅ 여기서 이미지 크기만 조정
    height: 500,
    resizeMode: "contain",
  },
  imageBorrow: {
    transform: [
        { rotate: "10deg" },   // 왼쪽으로 10도 기울기 (양수면 오른쪽으로)
        { translateY: 0 },     // ✅ 이미지 아래로 20px 이동
    ],
  },
  imageReturn: {
    transform: [
        { rotate: "0deg" },   // 왼쪽으로 10도 기울기 (양수면 오른쪽으로)
        { translateY: 30 },     // ✅ 이미지 아래로 20px 이동
    ],
  },
});
