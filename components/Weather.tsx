import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const API_URL = "http://192.168.3.96:3000";

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
    } catch (error) {
      console.error("날씨 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.view, { backgroundColor: "white" }]}>
      <Image source={{ uri: `https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@${weather.weather?.[0]?.id}.png` }} />
      <Text style={[{ color: "#999" }, styles.textTypo]}>오늘 날씨</Text>
      <Text style={[{ color: "#537bff" }, styles.textTypo]}>{weather.weather?.[0]?.description}</Text>
    </View>
  );
};

export default Weather;

const styles = StyleSheet.create({
  textTypo: {
    textAlign: "right",
    fontFamily: "Pretendard",
    fontWeight: "500",
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
