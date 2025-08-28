import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";

const API_URL = "https://bbosong-back-production.up.railway.app";

const Weather = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    try {
      setLoading(true);

      // 위도/경도 예시값 (서울)
      const lat = 37.5665;
      const lon = 126.978;

      const res = await axios.get(`${API_URL}/weather/current`, {
        params: { lat, lon },
      });
      console.log("날씨 데이터:", res.data);
      setWeather(res.data);
      console.log("현재 날씨 상태:", weather);
    } catch (error) {
      console.error("날씨 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <View style={[styles.view, { backgroundColor: "white" }]}>
        <ActivityIndicator size="small" color="#537bff" />
        <Text style={[{ color: "#999" }, styles.textTypo]}>
          날씨 불러오는 중...
        </Text>
      </View>
    );
  }
  if (!weather || !weather.weather) {
    return (
      <View style={[styles.view, { backgroundColor: "white" }]}>
      <Text style={[{ color: "#999" }, styles.textTypo]}>오늘 날씨</Text>
      <Text style={[{ color: "#537bff" }, styles.textTypo]}>맑음</Text>
    </View>
    )
  }
  return (
    <View style={[styles.view, { backgroundColor: "white" }]}>
      <Image
        source={{
          uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
        }}
        style={{ width: 30, height: 30 }}
      />
      <Text style={[{ color: "#999" }, styles.textTypo]}>오늘 날씨</Text>
      <Text style={[{ color: "#537bff" }, styles.textTypo]}>
        { weather.weather }
      </Text>
    </View>
  );
};

export default Weather;

const styles = StyleSheet.create({
  textTypo: {
    textAlign: "right",
    fontWeight: "600",
    fontSize: 12,
  },
  view: {
    shadowColor: "rgba(153, 153, 153, 0.2)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 10,
    elevation: 7,
    shadowOpacity: 1,
    borderRadius: 19,
    width: "100%",
    height: 33,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 4,
    gap: 8,
  },
});
