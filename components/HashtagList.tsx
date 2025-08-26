import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "./src/frame-1707482364.svg";
import Hot from "./src/frame-1707482361.svg";
import Cool from "./src/frame-1707482362.svg";
import Cafe from "./src/frame-1707482365.svg";
import Rain from "./src/frame-1707482363.svg";
import IconChange from "./src/x.svg";

const API_URL = "http://192.168.45.96:3000";

const hashtagComponents = [
  { tag: "#hot", Component: Hot },
  { tag: "#cool", Component: Cool },
  { tag: "#cafe", Component: Cafe },
  { tag: "#rain", Component: Rain },
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

  return (
    <View style={styles.absoluteContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 4 }}
      >
        <TouchableOpacity style={styles.iconWrapper} onPress={handleReset}>
          {selectedTag === null ? <Icon /> : <IconChange />}
        </TouchableOpacity>
        {selectedTag === null
          ? hashtagComponents.map(({ tag, Component }) => (
              <TouchableOpacity key={tag} onPress={() => handleTagPress(tag)}>
                <Component />
              </TouchableOpacity>
            ))
          : (() => {
              const selected = hashtagComponents.find(
                (h) => h.tag === selectedTag
              );
              if (!selected) return null;
              const SelectedComponent = selected.Component;
              return (
                <TouchableOpacity onPress={() => setSelectedTag(null)}>
                  <SelectedComponent />
                </TouchableOpacity>
              );
            })()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    position: "absolute",
    top: 94,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  container: {
    backgroundColor: "transparent",
    marginTop: 0,
    marginBottom: 0,
    flexDirection: "row",
    columnGap: 4,
  },
  iconWrapper: {
    display: "flex",
    width: 33,
    height: 33,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  tag: {
    backgroundColor: "#e0f7fa",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HashtagList;
