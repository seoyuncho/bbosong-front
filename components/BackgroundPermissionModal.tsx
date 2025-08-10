import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface BackgroundPermissionModalProps {
  isVisible: boolean;
  onConfirm: () => void;
}

const BackgroundPermissionModal: React.FC<BackgroundPermissionModalProps> = ({ isVisible, onConfirm }) => {
  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>백그라운드 위치 권한 안내</Text>
          <Text style={styles.modalText}>
            '뽀송'은 앱이 백그라운드에 있을 때도 우산 스테이션 근처에 도착하면 알림을 보내드리기 위해 위치 정보가 필요합니다.
          </Text>
          <Text style={styles.modalText}>
            다음 화면에서 '앱 사용 중에만 허용'이 아닌, {'\n'}"항상 허용"을 선택해주세요.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onConfirm}>
            <Text style={styles.buttonText}>확인하고 권한 설정하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BackgroundPermissionModal;