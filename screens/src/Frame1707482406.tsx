import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ellipse11 from "./ellipse-11.svg";
import Group from "./group.svg";

const Frame1707482406 = () => {
  return (
    <View style={styles.viewBg}>
      <View style={[styles.view, styles.viewShadowBox]}>
        <View style={styles.ellipseParent}>
          <Ellipse11 style={styles.frameChild} width={64} height={64} />
          <View style={styles.group}>
            <Text style={styles.text}>
              <Text style={styles.text1}>김뽀송</Text>
              <Text style={styles.text2}> 님</Text>
            </Text>
            <Text style={[styles.text3, styles.textTypo1]}>리워드 내용</Text>
          </View>
        </View>
        <View style={styles.roundedLayout}>
          <View style={[styles.roundedRectangle, styles.roundedLayout]} />
          <Group style={styles.groupIcon} />
          <Text style={[styles.text4, styles.textTypo]}>
            <Text style={styles.textTypo1}>{`매장 방문
`}</Text>
            <Text style={styles.text6}>리워드</Text>
          </Text>
        </View>
        <View style={styles.wrapper}>
          <Text style={[styles.text7, styles.textTypo]}>내 정보</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  viewShadowBox: {
    shadowOpacity: 1,
    elevation: 10,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(153, 153, 153, 0.2)",
  },
  textTypo1: {
    fontWeight: "500",
    fontFamily: "Pretendard",
  },
  roundedLayout: {
    height: 72,
    width: 72,
  },
  textTypo: {
    textAlign: "center",
    fontSize: 14,
  },
  frameChild: {
    width: 64,
    height: 64,
  },
  text1: {
    color: "#537bff",
  },
  text2: {
    color: "#111",
  },
  text: {
    fontSize: 18,
    letterSpacing: -0.4,
    fontWeight: "600",
    textAlign: "left",
    alignSelf: "stretch",
    fontFamily: "Pretendard",
  },
  text3: {
    color: "#676767",
    letterSpacing: -0.3,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
    alignSelf: "stretch",
  },
  group: {
    width: 111,
    gap: 15,
  },
  ellipseParent: {
    gap: 14,
    flexDirection: "row",
  },
  roundedRectangle: {
    top: 0,
    left: 0,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    position: "absolute",
    shadowOpacity: 1,
    elevation: 10,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: "rgba(153, 153, 153, 0.2)",
  },
  groupIcon: {
    height: "66.67%",
    width: "66.67%",
    top: "16.67%",
    right: "16.67%",
    bottom: "16.67%",
    left: "16.67%",
    maxWidth: "100%",
    overflow: "hidden",
    maxHeight: "100%",
    opacity: 0.16,
    position: "absolute",
  },
  text6: {
    fontWeight: "700",
    fontFamily: "Pretendard",
  },
  text4: {
    marginLeft: -25,
    top: 20,
    left: "50%",
    color: "#232323",
    position: "absolute",
    letterSpacing: -0.3,
  },
  text7: {
    width: 86,
    color: "#fff",
    fontWeight: "500",
    fontFamily: "Pretendard",
  },
  wrapper: {
    width: 315,
    borderRadius: 50,
    backgroundColor: "#232323",
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 145,
    paddingVertical: 15,
    flexDirection: "row",
  },
  view: {
    width: "100%",
    borderRadius: 36,
    flexWrap: "wrap",
    alignContent: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 22,
    rowGap: 20,
    columnGap: 50,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    flex: 1,
  },
  viewBg: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    flex: 1,
  },
});

export default Frame1707482406;
