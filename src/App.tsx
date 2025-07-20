import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, View, Text, Alert } from 'react-native';
import {
  CameraKitContext,
  CameraPreviewView,
  useCameraPermissions,
  useCameraKit,
} from '@snap/camera-kit-react-native';
import { CAMERA_KIT_API_TOKEN, CAMERA_KIT_LENS_REPOSITORY_TOKEN } from '@env';

const CameraScreen = () => {
  const cameraKit = useCameraKit();

  useEffect(() => {
    console.log('CameraKit status:', cameraKit);
  }, [cameraKit]);

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <CameraPreviewView style={{ flex: 1 }} />
    </View>
  );
};

const App = () => {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { request } = useCameraPermissions();

  useEffect(() => {
    setupPermissions();
  }, []);

  const setupPermissions = async () => {
    try {
      console.log('Setting up permissions...');
      
      if (Platform.OS === 'android') {
        // Request permissions for Android
        await request([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        setIsPermissionGranted(true);
      } else {
        // For iOS, permissions are handled by the system when camera is accessed
        setIsPermissionGranted(true);
      }
      
      console.log('Permissions setup complete');
    } catch (error) {
      console.error('Permission request failed:', error);
      setError('Permission request failed');
      Alert.alert('Permission Error', 'Camera permission is required to use this feature.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!isPermissionGranted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text>Camera permission is required</Text>
      </View>
    );
  }

  const apiToken = CAMERA_KIT_API_TOKEN || 'your_api_token_here';
  console.log('Using API Token:', apiToken.substring(0, 10) + '...');

  return (
    <CameraKitContext apiToken={apiToken}>
      <CameraScreen />
    </CameraKitContext>
  );
};

export default App;
