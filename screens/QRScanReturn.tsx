import React, { useState } from "react";
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
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import {jwtDecode} from 'jwt-decode';
import axios from "axios";

export default function QRScanReturn() {
  const [message, setMessage] = useState<string>("");
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const [station, action] = data.split("|");

      if (action !== "return") {
        setModalTitle("반납하는 QR이 아닙니다.");
        setModalMessage("올바른 QR을 다시 인식해주세요.");
        setModalVisible(true);
        setScanned(false);
        return;
      }

      const token = await AsyncStorage.getItem('token');    

      if (!token) {
        setModalTitle("회원가입/로그인이 필요합니다.");
        setModalMessage("대여/반납 기능을 사용하려면 로그인해주세요.");
        setModalVisible(true);
        setScanned(false);
        return;
      }

      const decoded: any = jwtDecode(token);
      console.log("Decoded JWT:", decoded);      
      const userId = Number(decoded.id);
        if (isNaN(userId)) {
          throw new Error('Invalid user ID in token');
      }

      const payload = { userId: userId, returnStationName: station };
      console.log("payload:", payload);

      const response = await axios.post("https://bbosong-back-production.up.railway.app/user-qr/return", payload);
      console.log("반납 성공:", response.data);

      setMessage(`✅ ${station} 에 우산 반납 완료`);
      await AsyncStorage.removeItem("umbrella_id"); // 반납 완료 후 캐시 삭제

      setTimeout(() => {
        navigation.navigate("QRReturnCommit" as never);
      }, 500);

    } catch (err: any) {
      console.warn("반납 실패:", err.response?.data || err.message);
      setModalTitle("반납 실패");
      setModalMessage(err.response?.data?.message || "반납 처리 중 오류가 발생했습니다.");
      setModalVisible(true);
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
              <Text style={styles.headerTitle}>뽀송이 반납</Text>
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

      {/* 에러 모달 */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => { // 모달 닫기
                if (modalTitle === "회원가입/로그인이 필요합니다.") {
                  setModalVisible(false);
                  navigation.navigate("Login" as never); // 🔑 로그인 필요 시
                } else {
                  setModalVisible(false);
                  navigation.navigate("QRScreen" as never); // 📷 일반 에러 시
                }
              }}>
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
      // left: -wp("%"), // 중앙정렬을 위한 트릭
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
    corner: { position: "absolute", width: wp("5%"), height: wp("5%"), borderColor: "#fff" },
    topLeft: { top: 0, left: 0, borderLeftWidth: 3, borderTopWidth: 3 },
    topRight: { top: 0, right: 0, borderRightWidth: 3, borderTopWidth: 3 },
    bottomLeft: { bottom: 0, left: 0, borderLeftWidth: 3, borderBottomWidth: 3 },
    bottomRight: { bottom: 0, right: 0, borderRightWidth: 3, borderBottomWidth: 3 },
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
  messageBox: { position: "absolute", bottom: 100, alignSelf: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  messageText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  permissionText: { fontSize: 18, marginBottom: 20, color: "#333" },
  permissionBtn: { backgroundColor: "#537BFF", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  permissionBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalBox: { width: 280, backgroundColor: "#B0B0B0", borderRadius: 30, padding: 20, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#007AFF", textAlign: "center" },
  modalMessage: { fontSize: 14, textAlign: "center", marginBottom: 16, color: "#666" },
  modalButton: { backgroundColor: "#007AFF", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 30 },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
