import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MainScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text>뽀송</Text>
      <Text>오늘 날씨: </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
            navigation.navigate('Map');;
        }}
      >
        <Text style={styles.buttonText}>지도 보기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
                onPress={() => {
            navigation.navigate('QR');
        }}
      >
        <Text style={styles.buttonText}>QR 찍기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
            navigation.navigate('MyPage');
        }}
      >
        <Text style={styles.buttonText}>내 정보</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 200,
    height: 60,
    backgroundColor: '#4e8cff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default MainScreen;