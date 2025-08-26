import React, { useCallback, useEffect, useState } from "react";
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
import { useNavigation, useIsFocused} from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function QRScanBorrow() {
  const [message, setMessage] = useState<string>("");
  const [scanned, setScanned] = useState(false);  // ✅ 중복 방지 플래그
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

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const [station, action] = data.split("|");
      const payload: any = { station, action };

      // 반납일 경우 저장해둔 umbrella_id 같이 보냄
      // if (action === "return") {
      //   const savedUmbrellaId = await AsyncStorage.getItem("umbrella_id");
      //   if (!savedUmbrellaId) {
      //     throw new Error("반납할 umbrella_id가 없습니다 (캐시 없음)");
      //   }
      //   payload.umbrella_id = savedUmbrellaId;
      // }

      console.log("QR payload:", payload);

      const response = await axios.post(" http://10.254.205.115:3000/qr-scan/scan", payload);
      console.log("response.data:", response.data);

      if (action === "borrow" && response.data.umbrella?.id) {
        await AsyncStorage.setItem("umbrella_id", response.data.umbrella.id.toString());
        console.log("umbrella_id cached:", response.data.umbrella.id);
      }

      if (action === "borrow") {
        setMessage(`📦 ${station} 에서 우산 대여`);
      // } else if (action === "return") {
      //   setMessage(`✅ ${station} 에 우산 반납`);
      //   // 📌 반납 끝나면 캐시 삭제
      //   await AsyncStorage.removeItem("umbrella_id");
      } else {
        setMessage("❓ 알 수 없는 액션");
      }

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
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
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
              <TouchableOpacity onPress={() => navigation.navigate("QRScreen" as never)}>
                <Ionicons name="arrow-back" size={24} color="#F1F1F1" />
              </TouchableOpacity>
              <Text style={styles.title}>뽀송이 대여</Text>
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
      {/* ❌ 에러 모달 */}
      <Modal transparent visible={errorVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>QR 인식에 실패했어요!</Text>
            <Text style={styles.modalMessage}>
              QR 코드가 가려지거나 충분한 빛이 없으면 스캔이 어려워요
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setErrorVisible(false); // 모달 닫기
                navigation.navigate("QRScreen" as never); // 메인으로 이동
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
