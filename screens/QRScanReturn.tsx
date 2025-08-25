// import React, { useState } from "react";
// import {
//   Platform,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import { useNavigation, useIsFocused } from "@react-navigation/native";
// import { Ionicons } from '@expo/vector-icons';
// import axios from "axios";

// export default function QrScanReturn() {
//   const [message, setMessage] = useState<string>("");
//   const navigation = useNavigation();
//   const isFocused = useIsFocused(); // ✅ 화면 focus 체크

//   const [permission, requestPermission] = useCameraPermissions();
//   const isPermissionGranted = Boolean(permission?.granted);

//   const handleBarcodeScanned = async ({ data }: { data: string }) => {
//     try {
//       const [station, action, umbrellaId] = data.split("|");
//       const payload = { station, action, umbrellaId };
//       console.log("QR payload:", payload);

//       if (action === "borrow") {
//         setMessage(`📦 ${station} 에서 우산 대여`);
//       } else if (action === "return") {
//         setMessage(`✅ ${station} 에 우산 ${umbrellaId} 반납`);
//       } else {
//         setMessage("❓ 알 수 없는 액션");
//       }
//       // axios 사용
//       const response = await axios.post("https://your-backend.com/api/umbrella", payload);

//       if (response.status === 200) {
//         navigation.navigate("qrReturnCommit" as never);
//       } else {
//         console.warn("서버 전송 실패:", response.data);
//         setMessage("⚠️ 서버 전송 실패");
//       }
//     } catch (e) {
//       console.warn("Invalid QR data", e);
//       setMessage("QR 코드 오류 ⚠️");
//     }
//   };

//   // 권한 없는 경우 안내창
//   if (!isPermissionGranted) {
//     return (
//       <SafeAreaView style={styles.permissionContainer}>
//         <Text style={styles.permissionText}>카메라 권한이 필요합니다 📷</Text>
//         <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
//           <Text style={styles.permissionBtnText}>카메라 허용하기</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       {Platform.OS === "android" ? <StatusBar hidden /> : null}

//       {/* 화면 focus 되었을 때만 Camera 렌더링 */}
//       {isFocused && (
//         <CameraView
//           style={styles.camStyle}
//           facing="back"
//           barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
//           onBarcodeScanned={handleBarcodeScanned}
//         >
//           <View style={styles.overlay}>
//             {/* 상단 영역 */}
//             <View style={styles.header}>
//               <TouchableOpacity onPress={() => navigation.navigate("qrMain" as never)}>
//                 <Ionicons name="arrow-back" size={24} color="#F1F1F1" />
//               </TouchableOpacity>
//               <Text style={styles.title}>뽀송이 반납</Text>
//             </View>

//             {/* 안내 문구 */}
//             <Text style={styles.subtitle}>
//               반납을 위해 뽀송 스테이션에{"\n"}부착된 QR 코드를 찍어주세요.
//             </Text>

//             {/* 모서리만 있는 스캔 박스 */}
//             <View style={styles.scanBox}>
//               <View style={[styles.corner, styles.topLeft]} />
//               <View style={[styles.corner, styles.topRight]} />
//               <View style={[styles.corner, styles.bottomLeft]} />
//               <View style={[styles.corner, styles.bottomRight]} />
//             </View>

//             {/* 버튼 */}
//             <TouchableOpacity style={styles.button}>
//               <Text style={styles.buttonText}>QR 번호 직접 입력</Text>
//             </TouchableOpacity>
//           </View>
//         </CameraView>
//       )}

//       {/* 결과 메시지 */}
//       {message ? (
//         <View style={styles.messageBox}>
//           <Text style={styles.messageText}>{message}</Text>
//         </View>
//       ) : null}
//     </SafeAreaView>
//   );
// }

import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

export default function QRScanReturn() {
  const [message, setMessage] = useState<string>("");
  const [scanned, setScanned] = useState(false); // ✅ QR 중복 방지
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return; // 이미 스캔했으면 무시
    setScanned(true);

    try {
      const [station, action] = data.split("|");
      const payload: any = { station, action };

      if (action === "return") {
        const savedUmbrellaId = await AsyncStorage.getItem("umbrella_id");
        if (!savedUmbrellaId) {
          setMessage("⚠️ 반납할 umbrella_id가 없습니다");
          setScanned(false);
          return;
        }
        payload.umbrellaId = savedUmbrellaId;
      }

      console.log("QR payload:", payload);

      const response = await axios.post(" http://10.254.205.115:3000/qr-scan/scan", payload);
      console.log("response.data:", response.data);

      // 메시지 처리
    //   if (action === "borrow" && response.data.umbrella?.id) {
    //     await AsyncStorage.setItem("umbrella_id", response.data.umbrella.id.toString());
    //     setMessage(`📦 ${station} 에서 우산 대여 완료`);
    //   } else 
      if (action === "return") {
        // await AsyncStorage.removeItem("umbrella_id"); // 캐시 삭제
        setMessage(`✅ ${station} 에 우산 반납 완료`);
      } else {
        setMessage("❓ 알 수 없는 액션");
      }

      // 잠시 후 화면 이동 (반납이면 Commit 화면, 대여이면 Borrow 화면)
      setTimeout(() => {
        if (action === "return") {
          navigation.navigate("QRReturnCommit" as never);
        } 
      }, 1500);

    } catch (err:any) {
      console.warn("POST failed:", err.response?.data || err.message);
      setMessage("⚠️ 서버 전송 실패");
      setScanned(false);
    }
  };

  if (!isPermissionGranted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>카메라 권한이 필요합니다 📷</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>카메라 허용하기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      {isFocused && (
        <CameraView
          style={styles.camStyle}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.navigate("QRScreen" as never)}>
                <Ionicons name="arrow-back" size={24} color="#F1F1F1" />
              </TouchableOpacity>
              <Text style={styles.title}>뽀송이 반납</Text>
              <View style={{ width: 24 }} />
            </View>

            <Text style={styles.subtitle}>
              반납을 위해 뽀송 스테이션에{"\n"}부착된 QR 코드를 찍어주세요.
            </Text>

            <View style={styles.scanBox}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>QR 번호 직접 입력</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      {message ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#565656" },
  camStyle: { flex: 1, width: "100%", alignItems: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(86, 86, 86, 0.5)",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  title: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -25 }],
    fontSize: 20,
    fontWeight: "bold",
    color: "#F1F1F1",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 140,
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
    lineHeight: 20,
  },
  scanBox: { marginTop: 80, width: 200, height: 200, justifyContent: "space-between" },
  corner: { position: "absolute", width: 20, height: 20, borderColor: "#fff" },
  topLeft: { top: 0, left: 0, borderLeftWidth: 3, borderTopWidth: 3 },
  topRight: { top: 0, right: 0, borderRightWidth: 3, borderTopWidth: 3 },
  bottomLeft: { bottom: 0, left: 0, borderLeftWidth: 3, borderBottomWidth: 3 },
  bottomRight: { bottom: 0, right: 0, borderRightWidth: 3, borderBottomWidth: 3 },
  button: {
    marginTop: 150,
    width: '90%',
    paddingVertical: 16,
    borderRadius: 30,
    height: 50,
    backgroundColor: '#537BFF',
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: { color: '#FDFDFD', fontSize: 16, fontWeight: '600' },
  messageBox: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  messageText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  permissionText: { fontSize: 18, marginBottom: 20, color: "#333" },
  permissionBtn: { backgroundColor: "#537BFF", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  permissionBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});