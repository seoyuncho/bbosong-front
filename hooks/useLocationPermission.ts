import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Alert, Platform } from 'react-native';
import BackgroundPermissionModal from '../components/BackgroundPermission';

const LOCATION_TASK_NAME = 'background-location-task';

/*TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    console.log('Received new location updates in background:', locations);
  }
});*/

/**
 * 위치 권한을 요청하고 백그라운드 위치 추적을 시작하는 커스텀 훅
 * @returns {boolean | null} 권한 상태 (true: 허용, false: 거부, null: 확인 중)
 */
export const useLocationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // 모달 가시성을 위한 상태 추가
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  useEffect(() => {
    const requestPermissions = async () => {
      console.log('requestPermissions');
      
      // 1. 포그라운드 권한 요청
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      console.log('Foreground permission status:', foregroundStatus);

      if (foregroundStatus !== 'granted') {
        setHasPermission(false);
        Alert.alert(
          "위치 권한 거부",
          "앱 사용을 위해 위치 권한이 필요합니다. 설정에서 권한을 허용해주세요."
        );
        return;
      }

      // 포그라운드 권한이 허용되면 hasPermission을 true로 설정
      setHasPermission(true);
      console.log('Foreground permission granted, setHasPermission(true)');

      // 포그라운드 권한이 허용되면 백그라운드 권한 처리
      if (Platform.OS === 'android' && Platform.Version >= 30) { 
        // 안드로이드 11 (API 30) 이상에서는 모달을 띄웁니다.
        setIsModalVisible(true);
        console.log('Android 11+, showing modal');
      } else {
        // 안드로이드 11 미만이거나 iOS인 경우 바로 백그라운드 권한 요청
        console.log('Android <11 or iOS, requesting background permission directly');
        await requestBackgroundPermission();
      }
    };
    
    requestPermissions();
  }, []);

  const requestBackgroundPermission = async () => {
    try {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      console.log('Background permission status:', backgroundStatus);
      
      if (backgroundStatus !== 'granted') {
        Alert.alert(
          "백그라운드 위치 권한 거부",
          "우산 스테이션 알림 등을 받으려면 백그라운드 위치 권한이 필요합니다. 설정에서 '항상 허용'으로 변경해주세요."
        );
      } else {
        console.log('Background permission granted, starting location tracking');
        await startBackgroundLocationTracking();
      }
    } catch (error) {
      console.error('Error requesting background permission:', error);
    }
  };

  const handleConfirmModal = async () => {
    console.log('Modal confirmed, requesting background permission');
    setIsModalVisible(false);
    await requestBackgroundPermission();
  };

  const startBackgroundLocationTracking = async () => {
    try {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (!hasStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.BestForNavigation,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: '뽀송',
            notificationBody: '우산 스테이션을 찾기 위해 위치를 추적 중입니다.',
            notificationColor: '#007BFF',
          },
        });
        console.log('Background location tracking started');
      }
    } catch (error) {
      console.error('Error starting background location tracking:', error);
    }
  };
  
  return { hasPermission, isModalVisible, handleConfirmModal };
};