import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const FindPasswordScreen = ({ navigation }: any) => (
  <View style={styles.container}>
    <Text style={styles.title}>비밀번호 찾기</Text>
    <TextInput placeholder="이메일 주소" style={styles.input} />
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>비밀번호 재설정 링크 받기</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Text style={styles.link}>로그인 화면으로 돌아가기</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  input: { width: 250, height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, marginBottom: 16, paddingHorizontal: 12 },
  button: { width: 200, height: 50, backgroundColor: '#007BFF', borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginVertical: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { color: '#007BFF', marginTop: 16 }
});

export default FindPasswordScreen;
