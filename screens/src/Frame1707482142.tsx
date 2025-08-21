import * as React from "react";
import { Text, StyleSheet, View, ImageBackground } from "react-native";
import Frame1707482139 from "./frame-1707482139.svg";
import Group5 from "./group-5.svg";
import { useNavigation } from '@react-navigation/native';

const MapCard = () => {
  const navigation = useNavigation<any>();

  return (
    <ImageBackground
      style={styles.container}
      source={require("./map.jpg")}
      imageStyle={styles.imageBg}
    >
      <View style={styles.textGroup}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>
            <Text style={styles.titleBlue}>지도 </Text>
            <Text style={styles.titleBlack}>보기</Text>
          </Text>
          <Frame1707482139 width={22} height={22} />
        </View>

        <Text style={styles.subText}>{`뽀송 스테이션과\n추천 매장을 확인해요`}</Text>
      </View>

      {/* 오른쪽 버튼 아이콘 */}
      <Group5 width={28} height={28} onPress={() => {
        navigation.navigate('Map');
      }} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    aspectRatio: 16 / 9,
    borderRadius: 33,
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 28,
    flexDirection: "row",
  },
  imageBg: {
    resizeMode: "stretch",
    borderRadius: 33, // 배경 이미지도 라운드 처리
  },
  textGroup: {
    width: 140,
    gap: 8, // 오토레이아웃 gap
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: -0.6,
    fontFamily: "Pretendard",
  },
  titleBlue: {
    color: "#537bff",
  },
  titleBlack: {
    color: "#111",
  },
  subText: {
    fontSize: 14,
    color: "#676767",
    lineHeight: 20,
    fontFamily: "Pretendard",
  },
});

export default MapCard;
