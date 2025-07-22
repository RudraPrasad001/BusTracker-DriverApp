import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import socket from '../../utils/socket';

export default function LocationTrackingScreen(bus_number:any) {
  const [text, setText] = useState("Stop Tracking");
  const watchId = useRef<Location.LocationSubscription | null>(null);

  const sendLocationToServer = async (lat: number, lon: number) => {
    console.log("🚀 Emitting to socket:", lat, lon);
    console.log(bus_number);
    socket.emit("location-update", {
      busId: bus_number.bus_number,
      coords: { latitude: lat, longitude: lon }
    });
  };

  const startTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    // Connect and join room
    socket.connect();
    socket.emit("start-tracking", bus_number.bus_number);

    watchId.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 0,
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
      socket.disconnect(); // disconnect from socket
      Alert.alert("Stopped", "Location tracking stopped.");
      console.log("🛑 Location tracking stopped.");
    }
  };

  useEffect(() => {
    startTracking();
    return () => {
      stopTracking();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Location Tracker</Text>
      <View style={styles.buttonContainer}>
        <Button title={text} onPress={() => { stopTracking(); setText("Stopped"); }} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', gap: 20 },
});
