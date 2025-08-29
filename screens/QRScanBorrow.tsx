import React, { useCallback, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export default function QRScanBorrow() {
  const [message, setMessage] = useState<string>("");
  const [scanned, setScanned] = useState(false); // ✅ 중복 방지 플래그
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setScanned(false); // focus 될 때 reset
    }
  }, [isFocused]);

  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [errorVisible, setErrorVisible] = useState(false); // ❌ 에러 팝업 상태
  const [modalType, setModalType] = useState<
    "scanError" | "noToken" | "scanTypeError" | null
  >(null);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const [station, action] = data.split("|");

      if (action !== "borrow") {
        setModalType("scanTypeError");
        throw new Error("❌ 대여 QR이 아닙니다.");
        //return;
      }

      // 1️⃣ AsyncStorage에서 토큰 가져오기
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setModalType("noToken");
        throw new Error("로그인 토큰이 없습니다.");
        //return;
      }
      // const decoded: any = jwtDecode(token);
      // console.log("Decoded JWT:", decoded);
      // const userId = Number(decoded.id);
      //   if (isNaN(userId)) {
      //     throw new Error('Invalid user ID in token');
      // }
      const userId = 3; // TODO: 임시 하드코딩

      // 2️⃣ Payload
      const payload = { userId: userId, borrowStationName: station };
      console.log("payload:", payload);

      // 3️⃣ Axios POST 요청 (user-qr borrow API)
      const response = await axios.post(
        "https://bbosong-back-production.up.railway.app/user-qr/rent",
        payload
      );

      console.log("borrow response:", response.data);

      if (response.data.umbrella?.id) {
        await AsyncStorage.setItem(
          "umbrella_id",
          response.data.umbrella.id.toString()
        );
        // umbrella 전체 정보도 저장
        await AsyncStorage.setItem(
          "umbrellaDB",
          JSON.stringify({ umbrella: response.data.umbrella })
        );
        console.log("umbrellaDB cached:", response.data.umbrella);
      }

      setMessage(`📦 ${station} 에서 우산 대여 완료`);

      setTimeout(() => {
        navigation.navigate("QRBorrowCommit" as never);
      }, 2000);
    } catch (err) {
      console.warn("POST failed:", err);
      setErrorVisible(true);
    }
  };

  // 권한 없는 경우 안내창
  if (!isPermissionGranted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionText}>카메라 권한이 필요합니다 📷</Text>
        <TouchableOpacity
          style={styles.permissionBtn}
          onPress={requestPermission}
        >
          <Text style={styles.permissionBtnText}>카메라 허용하기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === "android" ? <StatusBar hidden /> : null}

      {/* 화면 focus 되었을 때만 Camera 렌더링 */}
      {isFocused && (
        <CameraView
          style={styles.camStyle}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.overlay}>
            {/* 상단 영역 */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.navigate("QRScreen" as never)}
              >
                <Ionicons name="arrow-back" size={24} color="#F1F1F1" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>뽀송이 대여</Text>
            </View>

            {/* 안내 문구 */}
            <Text style={styles.subtitle}>
              대여를 위해 뽀송 스테이션에{"\n"}부착된 QR 코드를 찍어주세요.
            </Text>

            {/* 모서리만 있는 스캔 박스 */}
            <View style={styles.scanBox}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            {/* 버튼 */}
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>QR 번호 직접 입력</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
      <Modal transparent visible={modalType !== null} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {modalType === "scanError" ? (
              <>
                <Text style={styles.modalTitle}>QR 인식에 실패했어요!</Text>
                <Text style={styles.modalMessage}>
                  QR 코드가 가려지거나 충분한 빛이 없으면 스캔이 어려워요
                </Text>
              </>
            ) : modalType === "scanTypeError" ? (
              <>
                <Text style={styles.modalTitle}>대여용 QR이 아닙니다!</Text>
                <Text style={styles.modalMessage}>
                  올바른 QR을 다시 인식해주세요.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>
                  회원가입/로그인이 필요해요!
                </Text>
                <Text style={styles.modalMessage}>
                  대여/반납 기능을 사용하기 위해 {"\n"}
                  회원가입/로그인해주세요.
                </Text>
              </>
            )}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalType(null); // 모달 닫기
                if (modalType === "noToken") {
                  setModalType(null);
                  navigation.navigate("Login" as never); // 🔑 로그인 필요시
                } else {
                  setModalType(null);
                  navigation.navigate("QRScreen" as never); // 📷 일반 에러시
                }
              }}
            >
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 결과 메시지 */}
      {message ? (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#565656",
    justifyContent: "space-between",
  },
  camStyle: { flex: 1, width: "100%", alignItems: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(86, 86, 86, 0.5)",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: hp("7%"),
    paddingHorizontal: wp("5%"), // arrow 끝까지 붙도록
    justifyContent: "space-between",
  },
  backButton: {
    width: wp("6%"),
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: wp("5%"),
    left: -wp("1.5%"), // 중앙정렬을 위한 트릭
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  subtitle: {
    marginTop: hp("15%"),
    fontSize: wp("5%"),
    textAlign: "center",
    color: "#fff",
    lineHeight: hp("3.5%"),
  },
  scanBox: {
    marginTop: hp("10%"),
    width: wp("50%"),
    height: wp("50%"),
    justifyContent: "space-between",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
    width: wp("5%"),
    height: wp("5%"),
    borderColor: "#fff",
  },
  topLeft: { top: 0, left: 0, borderLeftWidth: 3, borderTopWidth: 3 },
  topRight: { top: 0, right: 0, borderRightWidth: 3, borderTopWidth: 3 },
  bottomLeft: { bottom: 0, left: 0, borderLeftWidth: 3, borderBottomWidth: 3 },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  button: {
    position: "absolute",
    backgroundColor: "#537BFF",
    borderRadius: wp("5%"),
    width: wp("90%"),
    height: hp("6%"),
    bottom: hp("2%"),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("4%"),
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
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
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  permissionText: { fontSize: 18, marginBottom: 20, color: "#333" },
  permissionBtn: {
    backgroundColor: "#537BFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: 280,
    backgroundColor: "#B0B0B0",
    borderRadius: 30,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#007AFF",
  },
  modalMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    color: "#666",
  },
  modalButton: {
    backgroundColor: "#007AFF", // 🔵 Apple 기본 블루톤
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
