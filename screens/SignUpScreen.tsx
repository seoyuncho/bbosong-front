import { formToJSON } from 'axios';
import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  View, ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Arrow from './src/arrow.svg';
import axios from 'axios';
import { UserGender, UserType } from './enums/UserType';

const SignupScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: UserGender.MALE,
    birthdate: new Date(),
    userType: UserType.CUSTOMER,
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const API_URL = 'http://10.84.59.115:3000';

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleComplete = async () => {
    console.log('회원가입 정보:', formData);
    try {
      const response = await axios.post(`${API_URL}/user/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        birthdate: formData.birthdate,
        userType: formData.userType,
      });

      if (response.status === 201) {
        console.log('회원가입 성공:', response.data);
        setStep(4);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('회원가입 실패:', error.response?.data || error.message);
        alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
      } else {
        console.error('예상치 못한 오류:', error);
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleInputChange = (key: string, value: string | Date) => {
    setFormData({ ...formData, [key]: value });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: Date) => {
    handleInputChange('birthdate', date);
    hideDatePicker();
  };

  const genderLabels: Record<UserGender, string> = {
    [UserGender.MALE]: '남성',
    [UserGender.FEMALE]: '여성',
    [UserGender.OTHER]: '선택 안함',
  };

  const renderStep1 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>가입할 계정의 정보를{'\n'}입력해주세요.</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>이름</Text>
        <TextInput
          style={styles.input}
          placeholder="한글/영문 2글자 이상"
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>이메일 주소</Text>
        <TextInput
          style={styles.input}
          placeholder="example@google.com"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>비밀번호를{'\n'}설정해주세요.</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>비밀번호</Text>
        <TextInput
          style={styles.input}
          placeholder="8~16자, 영문 대소문자, 숫자 가능"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>비밀번호 확인</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          secureTextEntry
        />
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContainer}>
      <Text style={styles.stepTitle}>회원정보를{'\n'}입력해주세요.</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>이름</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          editable={false}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>성별</Text>
        <View style={styles.genderContainer}>
          {[UserGender.MALE, UserGender.FEMALE, UserGender.OTHER].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderButton,
                formData.gender === gender && styles.genderButtonActive,
              ]}
              onPress={() => handleInputChange('gender', gender)}>
              <Text
                style={[
                  styles.genderText,
                  formData.gender === gender && styles.genderTextActive,
                ]}>
                {genderLabels[gender]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>생년월일</Text>
        <TouchableOpacity style={styles.input} onPress={showDatePicker}>
          <Text style={styles.dateText}>
            {formData.birthdate.toLocaleDateString('ko-KR')}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          date={formData.birthdate}
          locale="ko-KR"
          {...(Platform.OS === 'ios' && { headerTextIOS: '생년월일 선택' })}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>어떤 용도로 사용하시나요?</Text>
        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              formData.userType === UserType.CUSTOMER && styles.userTypeButtonActive,
            ]}
            onPress={() => handleInputChange('userType', UserType.CUSTOMER)}>
            <Text style={styles.userTypeTitle}>일반 사용자</Text>
            <Text style={styles.userTypeDescription}>우산을 대여하고 싶어요.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              formData.userType === UserType.MANAGER && styles.userTypeButtonActive,
            ]}
            onPress={() => handleInputChange('userType', UserType.MANAGER)}>
            <Text style={styles.userTypeTitle}>점주</Text>
            <Text style={styles.userTypeDescription}>매장을 홍보하고 싶어요.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderComplete = () => (
    <View style={styles.completeContainer}>
      <Text style={styles.completeTitle}>회원가입이 완료되었습니다!</Text>
      <Text style={styles.completeText}>
        홈으로 이동하여 로그인하세요.
      </Text>
      <TouchableOpacity style={styles.nextButton} onPress={() => console.log('홈으로 이동')}>
      </TouchableOpacity>
    </View>
  );

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      <View
        style={[
          styles.stepIndicatorBar,
          { width: `${(step / 3) * 100}%` },
        ]}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Arrow width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
        {step <= 3 && <Text>{step}/3</Text>}
      </View>
      {step <= 3 && renderStepIndicator()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderComplete()}

      {step === 1 && (
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity style={styles.fullWidthButton} onPress={handleNext}>
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={[styles.halfButton, styles.previousButton]}
            onPress={handlePrevious}>
            <Text style={[styles.buttonText, { color: '#000' }]}>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.halfButton, styles.nextButton]}
            onPress={handleNext}>
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={[styles.halfButton, styles.previousButton]}
            onPress={handlePrevious}>
            <Text style={[styles.buttonText, { color: '#000' }]}>이전</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.halfButton, styles.nextButton]}
            onPress={handleComplete}>
            <Text style={styles.buttonText}>완료</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 4 && (
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={styles.fullWidthButton}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 30,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  backIcon: {
    marginRight: 12,
  },
  headerTitle: { fontSize: 15, fontWeight: '600' },
  stepIndicatorContainer: { height: 5, backgroundColor: '#eee' },
  stepIndicatorBar: { height: '100%', backgroundColor: '#007AFF' },
  stepContainer: { flex: 1, padding: 20 },
  stepTitle: { fontSize: 17, fontWeight: '600', marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    height: 40,
  },
  dateText: { color: '#000' },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  fullWidthButton: {
    flex: 1,
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halfButton: {
    flex: 1,
    padding: 15,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previousButton: { backgroundColor: '#eee', marginRight: 10 },
  nextButton: { backgroundColor: '#333' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  genderButtonActive: {
    backgroundColor: '#333',
  },
  genderText: {
    color: '#000',
  },
  genderTextActive: {
    color: '#fff',
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTypeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 13,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  userTypeButtonActive: { backgroundColor: '#eee', borderColor: '#000' },
  userTypeTitle: { fontWeight: 'bold' },
  userTypeDescription: { fontSize: 12, color: '#666' },
  completeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  completeTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  completeText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 50 },
});

export default SignupScreen;