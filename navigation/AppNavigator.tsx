import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import MapScreen from '../screens/MapScreen';
import QRScreen from '../screens/QRScreen';
import MyPageScreen from '../screens/MyPageScreen';
import SignUpScreen from '../screens/SignUpScreen';
import FindPasswordScreen from '../screens/FindPasswordScreen';
import BorrowInfo from '../screens/BorrowInfo';
import Extension from '../screens/Extension';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="BorrowInfo" screenOptions={{ headerShown: false }}> 
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="QR" component={QRScreen} />
      <Stack.Screen name="MyPage" component={MyPageScreen} />
      <Stack.Screen name="BorrowInfo" component={BorrowInfo} />
      <Stack.Screen name="Extension" component={Extension} />
    </Stack.Navigator>
  );
}
