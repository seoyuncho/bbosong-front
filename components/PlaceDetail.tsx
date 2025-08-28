import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  PanResponder,
} from "react-native";
import { Marker } from "../data/sampleMarkers";
import { LinearGradient } from "expo-linear-gradient";

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
  const [dragY, setDragY] = React.useState(0);
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        setDragY(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 60) {
          onClose();
        }
        setDragY(0);
      },
    })
  ).current;

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
        imageSource = require("./src/station100.png");
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
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.bottomView} pointerEvents="box-none">
          <View
            style={[
              styles.modalView,
              dragY > 0 ? { transform: [{ translateY: dragY }] } : null,
            ]}
            {...panResponder.panHandlers}
          >
            {imageSource && (
              <Image source={imageSource} style={styles.modalImage} />
            )}
            <View
              style={{
                flex: 2,
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
                margin: 14,
              }}
            >
              <Text style={styles.modalTitle}>{place.caption}</Text>
              <Text style={styles.modalSubtitle}>{place.subCaption}</Text>
              <LinearGradient
                colors={["#537BFF", "#8EC5FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  width: "100%",
                  height: 35,
                  borderRadius: 40,
                  paddingHorizontal: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 14, color: "white" }}>
                  현재 남은 우산
                </Text>
                <Text style={{ fontSize: 14, color: "white" }}>22/30</Text>
              </LinearGradient>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bottomView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    margin: 20,
  },
  modalImage: {
    flex: 1,
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
    marginRight: 4,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 22,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 22,
    elevation: 7,
    width: "100%",
    height: "30%",
    flexDirection: "row",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  modalSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  modalText: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default PlaceDetail;
