import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { saveToken } from '../services/authService';
import axios from 'axios';


const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const API_URL = 'http://192.168.0.92:3000';

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/user/login`, {
        email,
        password,
      });

      const token = response.data.token;
      console.log('로그인 성공! 토큰:', token);
      
      await saveToken(token);
      navigation.navigate('Main');

      
    } catch (error) {
      // 4xx, 5xx 같은 HTTP 에러 코드는 여기서 바로 잡힙니다.
      if (axios.isAxiosError(error)) {
        console.error('로그인 실패:', error.response?.data || error.message);
        // 사용자에게 에러 메시지 표시
        alert('로그인에 실패했습니다. 이메일과 비밀번호를 다시 확인해 주세요.');
      } else {
        console.error('예상치 못한 오류:', error);
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
    <View>
      <View style={styles.inputWrapper}>
        <Icon name="envelope" size={15} color="#888" style={styles.inputIcon} />
        <TextInput
          placeholder="이메일 주소를 입력해주세요."
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          placeholder="비밀번호를 입력해주세요."
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>
    </View>
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('로그인 버튼 클릭됨');
          handleLogin();
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 200,
    height: 45,
    backgroundColor: '#000000',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    width: 250,
    height: 40,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 12
  }
});

export default LoginScreen;