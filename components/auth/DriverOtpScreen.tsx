import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import Constants from 'expo-constants';
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const DriverOtpScreen = ({ phone_number }: any) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);

  const url = Constants.expoConfig?.extra?.BACKEND_URL;

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus to next input
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }

    // Backspace focus to previous
    if (!text && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 4) {
      Alert.alert("Invalid OTP", "OTP must be 4 digits.");
      return;
    }

    try {
      const response = await axios.post(`${url}/driver/verifyotp`, {
        otp: fullOtp,
        phone_number,
      });

      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        Alert.alert("Logged In", "Token saved!");
        router.replace("/home");
      } else {
        Alert.alert("Failed", response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      console.log("OTP verify error:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  if (!phone_number) {
    router.back();
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the 4-digit OTP</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
  key={index}
  ref={(ref) => { inputs.current[index] = ref!; }}
  style={styles.otpInput}
  keyboardType="number-pad"
  maxLength={1}
  value={digit}
  onChangeText={(text) => handleChange(text, index)}
  autoFocus={index === 0}
/>

        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DriverOtpScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 28,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 24,
    color: "#111827",
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 4,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: "100%",
    maxWidth: 300,
  },
  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
