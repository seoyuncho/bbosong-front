import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import { Animated } from "react-native";
import Icon from "./src/frame-1707482364.svg";
import HotBg from "./src/HotBg.svg";
import CoolBg from "./src/CoolBg.svg";
import CafeBg from "./src/CafeBg.svg";
import RainBg from "./src/RainBg.svg";
import IconChange from "./src/x.svg";
import Instruction from "./src/instruction.svg";

const API_URL = "https://bbosong-back-production.up.railway.app";

// 배경 + 텍스트/이모지 세트 정의
const hashtagComponents = [
  { tag: "#hot", label: "# 이열치열 🔥", Bg: HotBg },
  { tag: "#cool", label: "# 풀냉방 ❄️", Bg: CoolBg },
  { tag: "#cafe", label: "# 분좋카 ☕️", Bg: CafeBg },
  { tag: "#rain", label: "# 비가 오는 날에... 🌧️", Bg: RainBg },
];

interface HashtagListProps {
  onStoresFetched: (stores: any[]) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

const HashtagList = ({
  onStoresFetched,
  selectedTag,
  setSelectedTag,
}: HashtagListProps) => {
  const handleTagPress = async (tag: string) => {
    const tagToFetch = tag.startsWith("#") ? tag.substring(1) : tag;

    try {
      const response = await fetch(
        `${API_URL}/store/hashtag/${encodeURIComponent(tagToFetch)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data", data);

      const newMarkers = data.map((store: any) => ({
        id: `store-${store.id}`,
        latitude: parseFloat(store.latitude),
        longitude: parseFloat(store.longitude),
        caption: store.name,
        subCaption: store.address ?? "",
        description: store.category ?? "",
        image: { symbol: "blue" },
        store,
      }));
      console.log("Fetched stores:", newMarkers);

      onStoresFetched(newMarkers);
      setSelectedTag(tag);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      onStoresFetched([]);
      setSelectedTag(tag);
    }
  };

  const handleReset = () => {
    setSelectedTag(null);
    onStoresFetched([]);
  };

  const [showInstruction, setShowInstruction] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showInstruction) {
      fadeAnim.setValue(1);
      timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => setShowInstruction(false));
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showInstruction, fadeAnim]);

  const handleContainerPress = () => {
    if (showInstruction) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => setShowInstruction(false));
    }
  };

  return (
    <View style={styles.absoluteContainer} onTouchStart={handleContainerPress}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 4 }}
      >
        {/* 리셋 버튼 */}
        <TouchableOpacity style={styles.iconWrapper} onPress={handleReset}>
          {selectedTag === null ? <Icon /> : <IconChange />}
        </TouchableOpacity>

        {/* 해시태그 버튼들 */}
        {selectedTag === null
          ? hashtagComponents.map(({ tag, label, Bg }) => (
              <TouchableOpacity key={tag} onPress={() => handleTagPress(tag)}>
                <View style={styles.tagWrapper}>
                  <Bg height={35} />
                  <Text style={styles.tagText}>{label}</Text>
                </View>
              </TouchableOpacity>
            ))
          : (() => {
              const selected = hashtagComponents.find(
                (h) => h.tag === selectedTag
              );
              if (!selected) return null;
              const { label, Bg } = selected;
              return (
                <TouchableOpacity onPress={() => setSelectedTag(null)}>
                  <View style={styles.tagWrapper}>
                    <Bg style={{ height: 35 }} />
                    <Text style={styles.tagText}>{label}</Text>
                  </View>
                </TouchableOpacity>
              );
            })()}
      </ScrollView>

      {/* 사용법 안내 */}
      {showInstruction && (
        <Animated.View
          style={{ position: "absolute", top: 30, opacity: fadeAnim }}
        >
          <Instruction />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: "absolute",
    top: 93,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    columnGap: 4,
  },
  iconWrapper: {
    width: 33,
    height: 33,
    justifyContent: "center",
    alignItems: "center",
  },
  tagWrapper: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  tagText: {
    position: "absolute",
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});

export default HashtagList;
