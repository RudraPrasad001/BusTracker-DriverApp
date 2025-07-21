// screens/LocationTrackingScreen.tsx

import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function LocationTrackingScreen() {
  const [text,setText] = useState("Stop Tracking");
  const watchId = useRef<Location.LocationSubscription | null>(null);

  const sendLocationToServer = async (lat: number, lon: number) => {
    console.log("Sending to server:", lat, lon);
    // Your API call goes here
  };

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    watchId.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,      // every 5 seconds
        distanceInterval: 0,     // even if not moved
      },
      (location) => {
        const { latitude, longitude } = location.coords;
        console.log("📍 New location:", latitude, longitude);
        sendLocationToServer(latitude, longitude);
      }
    );
  };

  const stopTracking = () => {
    if (watchId.current) {
      watchId.current.remove();
      watchId.current = null;
      Alert.alert("Stopped", "Location tracking stopped.");
      console.log("🛑 Location tracking stopped.");
    }
  };

  useEffect(() => {
    startTracking();

    return () => {
      stopTracking(); // Cleanup on screen unmount
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Location Tracker</Text>
      <View style={styles.buttonContainer}>
        <Button title={text} onPress={()=>{stopTracking();setText("Stopped")}} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', gap: 20 },
});
