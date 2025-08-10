import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';
import MapScreen from '../screens/MapScreen';
import QRScreen from '../screens/QRScreen';
import MyPageScreen from '../screens/MyPageScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}> 
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="QR" component={QRScreen} />
      <Stack.Screen name="MyPage" component={MyPageScreen} />
    </Stack.Navigator>
  );
}
