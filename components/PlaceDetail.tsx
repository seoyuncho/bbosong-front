import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Marker } from "../data/sampleMarkers";

interface PlaceDetailProps {
  isVisible: boolean;
  onClose: () => void;
  place: Marker | null;
}

const PlaceDetail: React.FC<PlaceDetailProps> = ({
  isVisible,
  onClose,
  place,
}) => {
  if (!place) {
    return null;
  }

  const store = place.store;

  // 이미지 소스 결정
  let imageSource = null;
  if (store?.imageUrl) {
    imageSource = { uri: store.imageUrl };
  } else if (store?.category) {
    // 카테고리별 이미지 매핑
    switch (store.category) {
      case "station":
        imageSource = require("./src/station.png");
        break;
      case "recommendation":
        imageSource = require("./src/recommendation.png");
        break;
      case "sponsor":
        imageSource = require("./src/sponsor.png");
        break;
      case "culture":
        imageSource = require("./src/culture.png");
      default:
        imageSource = { symbol: "gray" };
    }
  } else if (place.image?.symbol) {
    // 기존 심볼 매핑
    imageSource = require("../assets/icon.png");
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.bottomView}>
        <View style={styles.modalView}>
          {imageSource && (
            <Image source={imageSource} style={styles.modalImage} />
          )}
          <View>
            <Text style={styles.modalTitle}>{place.caption}</Text>
            <Text style={styles.modalSubtitle}>{place.subCaption}</Text>
            <Text style={styles.modalText}>{place.description}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.textStyle}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "cover",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PlaceDetail;
