import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import MapScreen from '../screens/MapScreen';
import QRScreen from '../screens/QRScreen';
import QRScanBorrow from '../screens/QRScanBorrow';
import QRBorrowCommit from '../screens/QRBorrowCommit';
import QRBorrowComplete from '../screens/QRBorrowComplete';
import QRBorrowRecommend from '../screens/QRBorrowRecommend';
import QRScanReturn from '../screens/QRScanReturn';
import QRReturnCommit from '../screens/QRReturnCommit';
import QRReturnComplete from '../screens/QRReturnComplete';
import QRReturnReward from '../screens/QRReturnReward'
import MyPageScreen from '../screens/MyPageScreen';
import SignUpScreen from '../screens/SignUpScreen';
import FindPasswordScreen from '../screens/FindPasswordScreen';
import BorrowInfo from '../screens/BorrowInfo';
import Extension from '../screens/Extension';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}> 
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="QRScreen" component={QRScreen} />
      <Stack.Screen name="MyPage" component={MyPageScreen} />
      <Stack.Screen name="QRScanBorrow" component={QRScanBorrow} />
      <Stack.Screen name="QRBorrowCommit" component={QRBorrowCommit} />
      <Stack.Screen name="QRBorrowComplete" component={QRBorrowComplete} />
      <Stack.Screen name="QRBorrowRecommend" component={QRBorrowRecommend} />
      <Stack.Screen name="QRScanReturn" component={QRScanReturn} />
      <Stack.Screen name="QRReturnCommit" component={QRReturnCommit} />
      <Stack.Screen name="QRReturnComplete" component={QRReturnComplete} />
      <Stack.Screen name="QRReturnReward" component={QRReturnReward} />
      <Stack.Screen name="BorrowInfo" component={BorrowInfo} />
      <Stack.Screen name="Extension" component={Extension} />
    </Stack.Navigator>
  );
}
