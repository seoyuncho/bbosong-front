import * as React from "react";
import { Text, StyleSheet, View, ImageBackground } from "react-native";
import Frame1707482137 from "./frame-1707482137.svg";
import Group5 from "./group-5.svg";
import { useNavigation } from '@react-navigation/native';

const Frame1707482143 = () => {
  const navigation = useNavigation<any>();

  return (
    <ImageBackground
      style={styles.frameParent}
      resizeMode="stretch"
      source={require("./qr.png")}
      imageStyle={styles.imageBg}
    >
      <View style={styles.frameGroup}>
        <View style={styles.qrParent}>
          <Text style={[styles.qr, styles.qrTypo]}>
            <Text style={styles.qr1}>QR</Text>
            <Text style={styles.text}> 찍기</Text>
          </Text>
          <Frame1707482137 style={styles.frameChild} width={22} height={22} />
        </View>
        <Text style={[styles.text1, styles.qrTypo]}>우산을 대여/반납해요</Text>
      </View>
      <Group5 style={styles.frameItem} width={28} height={28} onPress={() => {
        navigation.navigate('QRScreen');
      }} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageBg: {
    resizeMode: "stretch",
    borderRadius: 33,
  },
  qrTypo: {
    textAlign: "left",
    fontFamily: "Pretendard",
  },
  qr1: {
    color: "#537bff",
  },
  text: {
    color: "#111",
  },
  qr: {
    fontSize: 24,
    letterSpacing: -0.6,
    fontWeight: "600",
  },
  frameChild: {
    width: 22,
    height: 22,
  },
  qrParent: {
    alignItems: "center",
    gap: 15,
    alignSelf: "stretch",
    flexDirection: "row",
  },
  text1: {
    fontSize: 14,
    letterSpacing: -0.3,
    color: "#676767",
    alignSelf: "stretch",
  },
  frameGroup: {
    width: 115,
    gap: 12,
  },
  frameItem: {
    width: 28,
    height: 28,
  },
  frameParent: {
    aspectRatio: 16 / 10,
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 30,
    gap: 0,
    flexDirection: "row",
    borderRadius: 33,
  },
});

export default Frame1707482143;
