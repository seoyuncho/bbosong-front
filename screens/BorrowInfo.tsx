import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function BorrowInfo() {
  const navigation = useNavigation();
  const [stationName, setStationName] = useState("");
  const [rentStart, setRentStart] = useState<Date | null>(null);
  const [rentEnd, setRentEnd] = useState<Date | null>(null);
  const [usedTime, setUsedTime] = useState("");
  const [remainingTime, setRemainingTime] = useState("");
  const [returnTimeText, setReturnTimeText] = useState("");

  useEffect(() => {
    const fetchUmbrellaInfo = async () => {
      try {
        const umbrellaId = await AsyncStorage.getItem("umbrella_id");
        if (!umbrellaId) return;

        const res = await axios.get(
          `http://10.254.205.115:3000/qr-scan/umbrella/${umbrellaId}`
        );
        const umbrella = res.data.umbrella;

        setStationName(umbrella.station.name);
        const start = new Date(umbrella.rent_start);
        const end = new Date(umbrella.rent_end);
        setRentStart(start);
        setRentEnd(end);

        // 사용시간 계산
        const now = new Date();
        const usedMs = now.getTime() - start.getTime();
        const usedHours = Math.floor(usedMs / (1000 * 60 * 60));
        const usedMinutes = Math.floor(
          (usedMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        setUsedTime(`${usedHours}시간 ${usedMinutes}분`);

        // 남은시간 계산
        const remainingMs = end.getTime() - now.getTime();
        if (remainingMs > 0) {
          const remHours = Math.floor(remainingMs / (1000 * 60 * 60));
          const remMinutes = Math.floor(
            (remainingMs % (1000 * 60 * 60)) / (1000 * 60)
          );
          setRemainingTime(`${remHours}시간 ${remMinutes}분 남음`);
        } else {
          setRemainingTime("반납시간 초과");
        }

        // 반납시간 텍스트 계산
        const nowDate = new Date();
        const isToday = end.toDateString() === nowDate.toDateString();
        const dayText = isToday ? "오늘" : "내일";
        const hours = end.getHours();
        const minutes = end.getMinutes();
        const ampm = hours < 12 ? "오전" : "오후";
        const displayHour = hours % 12 === 0 ? 12 : hours % 12;
        const displayMinutes = minutes.toString().padStart(2, "0");
        setReturnTimeText(
          `${dayText} ${ampm} ${displayHour}시 ${displayMinutes}분까지`
        );
      } catch (err) {
        console.warn(err);
      }
    };

    fetchUmbrellaInfo();
  }, []);

  return (
    <LinearGradient
      colors={["#FFFFFF", "#CDD7E4", "#A1ACD280"]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      {/* 상단 네비게이션 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("QRReturnCommit" as never)}
        >
          <Icon name="arrow-back" size={wp("6%")} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>대여 시간</Text>
        <View style={{ width: wp("5%") }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>현재 뽀송이를 이용 중이에요.</Text>
        <Image
          source={require("../assets/umbrella_borrow.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.infoBoxOverlay}>
          <Text style={styles.infoText}>
            사용한 시간: <Text style={styles.highlight}>{usedTime}</Text>
          </Text>
          <Text style={styles.infoText}>반납 시간: {returnTimeText}</Text>
          <Text style={styles.subInfo}>반납 시간까지 {remainingTime} 남음</Text>
        </View>
      </View>

      {/* 하단 버튼 */}
      <TouchableOpacity
        style={styles.buttonb}
        onPress={() => navigation.navigate("QRReturnComplete" as never)}
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
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   header: {
//     position: 'absolute',
//     top: 50,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   backButton: {
//     position: 'absolute', // 왼쪽에 고정
//     left: 20,
//   },

//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#111111',
//   },
//   subTitle: {
//     fontSize: 18,
//     color: '#537BFF',
//     marginTop: 100,
//   },
//   code: {
//     fontWeight: '600',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#111111',
//     marginTop: 8,
//   },
//   infoBoxOverlay: {
//     position: 'absolute',
//     bottom: 90, // 이미지 아래쪽에서 50 정도 위로 올리기
//     alignItems: 'center',
//   },
//   image: {
//     width: '90%',   // 화면 폭의 90%
//     height: 500,
//     aspectRatio: 1, // 정사각 비율 유지
//     bottom: '10%',
//   },

//   infoBox: {
//     alignItems: 'center',
//   },
//   infoText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111111',
//   },
//   highlight: {
//     color: '#537BFF',
//   },
//   subInfo: {
//     marginTop: 6,
//     fontSize: 16,
//     color: '#111111',
//     opacity: 0.7,
//   },
//   button: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//     width: '90%',
//     height: 46,
//     borderRadius: 40,
//     backgroundColor: '#537BFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     // paddingHorizontal 제거
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: hp("5%"),
    // // paddingBottom: hp("5%"), // 이미지와 겹치지 않도록 여유 공간 추가
  },
  headerTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
  subTitle: {
    textAlign: "center",
    fontSize: wp("5%"), // 18px → 화면 폭 기준
    color: "#537BFF",
    fontWeight: "600",
    //paddingTop: hp("1%"), // 100px → 화면 높이 기준
  },
  title: {
    textAlign: "center",
    fontSize: wp("6%"), // 22px → 화면 폭 기준
    fontWeight: "600",
    color: "#111",
    marginTop: hp("1%"), // 8px → 화면 높이 기준
  },
  infoBoxOverlay: {
    position: "absolute",
    bottom: hp("10%"), // 90px → 화면 높이 기준
    alignItems: "center",
  },
  image: {
    height: hp("50%"), // 500px → 화면 높이 기준
    aspectRatio: 1,
    padding: hp("10%"),
  },
  infoText: {
    fontSize: wp("5%"), // 20px → 화면 폭 기준
    fontWeight: "600",
    alignSelf: "flex-start",
    color: "#111111",
    //paddingBottom: hp("1%"), // 8px → 화면 높이 기준
    paddingTop: hp("1%"), // 8px → 화면 높이 기준
  },
  highlight: {
    color: "#537BFF",
  },
  subInfo: {
    marginTop: hp("1%"), // 6px → 화면 높이 기준
    fontSize: wp("4.5%"), // 16px → 화면 폭 기준
    color: "#343434",
    opacity: 0.67,
  },
  button: {
    backgroundColor: "#537BFF",
    borderRadius: wp("10%"),
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    marginBottom: hp("7%"),
  },
  buttonb: {
    backgroundColor: "#000000",
    borderRadius: wp("10%"),
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
});

// import React, { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// const BorrowInfo = ({ navigation }: any) => {
//   const [stationName, setStationName] = useState("");
//   const [rentEnd, setRentEnd] = useState<Date | null>(null);

//   useEffect(() => {
//     const fetchUmbrellaInfo = async () => {
//       try {
//         const umbrellaId = await AsyncStorage.getItem("umbrella_id");
//         if (!umbrellaId) return;

//         const response = await axios.get(
//           `http://10.254.205.115:3000/qr-scan/umbrella/${umbrellaId}`
//         );
//         console.log("borrow response:", response.data);
//         const umbrella = response.data.umbrella;
//         setStationName(umbrella.station.name);
//         setRentEnd(new Date(umbrella.rent_end));
//       } catch (err) {
//         console.warn("Failed to fetch umbrella info", err);
//       }
//     };

//     fetchUmbrellaInfo();
//   }, []);

//   // 📌 rent_end 표시 포맷 (내일 오전/오후 hh:mm)
//   const rentEndString = rentEnd
//     ? `${rentEnd.getHours() < 12 ? "오전" : "오후"} ${
//         rentEnd.getHours() % 12 || 12
//       }시 ${rentEnd.getMinutes().toString().padStart(2, "0")}분`
//     : "...";

//   return (
//     <LinearGradient
//       colors={["#FFFFFF", "#CDD7E4", "#A1ACD280"]}
//       locations={[0, 0.5, 1]}
//       style={styles.container}
//     >
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.navigate("Main")}
//         >
//           <Ionicons name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>대여 정보</Text>
//       </View>

//       <View style={{ flex: 1, width: '100%', paddingTop: 10 }}>
//         <Text style={styles.title}>현재 뽀송이를 이용 중이에요.</Text>

//         <View
//           style={{
//             width: "80%",
//             alignItems: "center",
//             flex: 1,
//             justifyContent: "center",
//           }}
//         >
//           <Image
//             source={require("../assets/umbrella_borrow.png")}
//             style={styles.image}
//             resizeMode="contain"
//           />
//           <View style={styles.infoBoxOverlay}>
//             <Text style={styles.infoText}>
//               사용한 시간: <Text style={styles.highlight}>21시간 35분</Text>
//             </Text>
//             <Text style={styles.infoText}>
//               반납 시간:{" "}
//               <Text style={styles.highlight}>오늘 오전 9시 41분까지</Text>
//             </Text>
//             <Text style={styles.subInfo}>
//               반납 시간까지 {rentEndString} 남음
//             </Text>
//           </View>
//         </View>
//       </View>

//       <TouchableOpacity
//         style={styles.button1}
//         onPress={() => navigation.navigate("Extension")}
//       >
//         <Text style={styles.buttonText}>반납하기</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate("Extension" as never)}
//       >
//         <Text style={styles.buttonText}>연장하기</Text>
//       </TouchableOpacity>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     flexDirection: "column",
//     padding: 20,
//   },
//   header: {
//     position: "absolute",
//     top: 50,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   backButton: {
//     position: "absolute",
//     left: 20,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#111111",
//     textAlign: "center",
//   },
//   subTitle: {
//     fontSize: 18,
//     color: "#537BFF",
//     marginTop: 100,
//   },
//   code: {
//     fontWeight: "600",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#111111",
//     marginTop: 100,
//     textAlign: "center",
//   },
//   infoBoxOverlay: {
//     position: "absolute",
//     bottom: 90,
//     alignItems: "center",
//   },
//   image: {
//     width: "90%",
//     height: 500,
//     aspectRatio: 1,
//     bottom: "10%",
//     margin: 30,
//   },
//   infoText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#111111",
//     textAlign: "left",
//   },
//   highlight: {
//     color: "#537BFF",
//   },
//   subInfo: {
//     marginTop: 6,
//     fontSize: 16,
//     color: "#111111",
//     opacity: 0.7,
//     textAlign: "center",
//   },
//   button1: {
//     position: "absolute",
//     bottom: 70,
//     alignSelf: "center",
//     width: "90%",
//     height: 46,
//     borderRadius: 40,
//     backgroundColor: "#000000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   button: {
//     position: "absolute",
//     bottom: 20,
//     alignSelf: "center",
//     width: "90%",
//     height: 46,
//     borderRadius: 40,
//     backgroundColor: "#537BFF",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default BorrowInfo;
