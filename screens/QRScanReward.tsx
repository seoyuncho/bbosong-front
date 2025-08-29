import React, { useEffect, useState } from "react"; 
import { jwtDecode } from 'jwt-decode';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import {
  Dimensions,
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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function QRScanReward() {
  const [message, setMessage] = useState<string>("");
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) setScanned(false);
  }, [isFocused]);

  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [modalType, setModalType] = useState<"scanError" | "noToken" | "scanTypeError"|null>(null);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const [storeName, action] = data.split("|");

      if (action !== "reward") {
        setModalType("scanTypeError");
        throw new Error("❌ 리워드 QR이 아닙니다.");
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setModalType("noToken");
        throw new Error("로그인 토큰이 없습니다.");
      }

    //   const decoded: any = jwtDecode(token);
    //   const userId = Number(decoded.id);
    //   if (isNaN(userId)) throw new Error('Invalid user ID in token');
      const userId = 3;

      const payload = { userId, storeName };

      const response = await axios.post(
        "https://bbosong-back-production.up.railway.app/user-qr/redeem-bubble",
        payload
      );

      setMessage(`🎉 ${storeName}에서 리워드 받기 완료!`);

      setTimeout(() => { navigation.navigate("RewardCommit" as never); }, 500);

    } catch (err) {
      console.warn("POST failed:", err);
      setModalType("scanError");
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
      {/* {Platform.OS === "android" ? <StatusBar hidden /> : null} */}

      {isFocused && (
        <CameraView
          style={styles.camStyle}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.navigate("QRScreen" as never)}>
                <Ionicons name="arrow-back" size={wp("6%")} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>리워드 받기</Text>
            </View>

            <Text style={styles.subtitle}>
              가게 리워드를 받기 위해{"\n"}가게에 있는 뽀송 QR을 스캔해주세요
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
                <Text style={styles.modalTitle}>리워드용 QR이 아닙니다!</Text>
                <Text style={styles.modalMessage}>
                  올바른 QR을 다시 인식해주세요.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>회원가입/로그인이 필요해요!</Text>
                <Text style={styles.modalMessage}>
                  리워드 받기 기능을 사용하기 위해 {"\n"}회원가입/로그인해주세요.
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalType(null);
                if (modalType === "noToken") navigation.navigate("Login" as never);
                else navigation.navigate("QRScreen" as never);
              }}
            >
              <Text style={styles.modalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  messageBox: {
    position: "absolute",
    bottom: hp("20%"),
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    borderRadius: wp("3%"),
  },
  messageText: { color: "#fff", fontSize: wp("4%"), fontWeight: "600" },
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  permissionText: { fontSize: wp("5%"), marginBottom: hp("2%"), color: "#333" },
  permissionBtn: { backgroundColor: "#537BFF", paddingHorizontal: wp("6%"), paddingVertical: hp("2%"), borderRadius: wp("2%") },
  permissionBtnText: { color: "#fff", fontSize: wp("4%"), fontWeight: "600" },

  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalBox: { width: wp("80%"), backgroundColor: "#B0B0B0", borderRadius: wp("7%"), padding: wp("5%"), alignItems: "center" },
  modalTitle: { fontSize: wp("5%"), fontWeight: "bold", marginBottom: hp("1%"), color: "#007AFF" },
  modalMessage: { fontSize: wp("4%"), textAlign: "center", marginBottom: hp("2%"), color: "#666" },
  modalButton: { backgroundColor: "#007AFF", borderRadius: wp("2%"), paddingVertical: hp("1.5%"), paddingHorizontal: wp("6%") },
  modalButtonText: { color: "#fff", fontSize: wp("4%"), fontWeight: "bold" },
});
