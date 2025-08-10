import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }: any) => (
  <View style={styles.container}>
    <View>
      <TextInput placeholder="이메일 주소를 입력해주세요." />
      <TextInput placeholder="비밀번호를 입력해주세요." secureTextEntry />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Main');
        }}
      >
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.horizontal}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SignUp');
        }}
      >
        <Text>회원가입</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('FindPassword');
        }}
      >
        <Text>비밀번호 찾기</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: '#000000',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold'
  },
  inputContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 12
  }
});

export default LoginScreen;