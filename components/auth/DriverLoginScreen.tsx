import axios from 'axios';
import Constants from "expo-constants";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const DriverLoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const url = Constants.expoConfig?.extra?.BACKEND_URL;

  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      Alert.alert("Invalid Input", "Please enter a valid 10-digit phone number.");
      return;
    }

        console.log(phoneNumber);

    setLoading(true);
    try {
      console.log(url);
      const response = await axios.post(`${url}/driver/sendotp`, {
        phone_number: phoneNumber
      });

      const data = response.data;
      if (data.success) {
        Alert.alert("Success", data.message);
        router.push(`/auth/verifyOtp?phone_number=${phoneNumber}`);
        // Navigate to OTP screen here if needed
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="number-pad"
        maxLength={10}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Sending..." : "Send OTP"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DriverLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex:1,
    width:"80%",
    backgroundColor: "#f2f2f2",
    height:100,
    alignItems: "center",
    flexDirection:"column",
    justifyContent: "center",
    // Added for better spacing on small screens
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
    color: "#222",
    textAlign: 'center', // Ensure text is centered
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 20,
    includeFontPadding: false, // Helps with vertical text alignment
    textAlignVertical: 'center', // Better for Android
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    justifyContent: 'center', // Better button text alignment
    minHeight: 50, // Minimum touch target size for accessibility
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false, // Better text vertical alignment
  },
});
