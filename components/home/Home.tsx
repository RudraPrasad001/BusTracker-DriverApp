import getInfo from "@/utils/getToken";
import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

const Home = () => {
  const [numberPlate, setNumberPlate] = useState("");
  const url = Constants.expoConfig?.extra?.BACKEND_URL;
const [driver, setDriver] = useState<any>(null);

  const getInformation = async () => {
    const temp = await getInfo();
    setDriver(temp);
  };

  useEffect(() => {
    getInformation();
  }, []);

  const handleLink = async () => {
    if (!numberPlate || numberPlate.length < 6) {
      Alert.alert("Error", "Enter a valid number plate");
      return;
    }

    try {
      const response = await axios.post(`${url}/driver/linkdriver`, {
        driver_id: driver.driver_id,
        number_plate: numberPlate.toUpperCase(),
      });

      if (response.data.success) {
        Alert.alert("Success", response.data.message);
        router.push({pathname:"/home/details",params:{number_plate:numberPlate}}); 
      } else {
        Alert.alert("Failed", response.data.message);
      }
    } catch (error) {
      console.log("Linking error:", error);
      Alert.alert("Error", "Something went wrong while linking.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.heading}>Link Your Bus</Text>
      <Text style={styles.label}>Enter your number plate:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. TN43HD1283"
        value={numberPlate}
        onChangeText={setNumberPlate}
        autoCapitalize="characters"
        maxLength={12}
      />
      <TouchableOpacity style={styles.button} onPress={handleLink}>
        <Text style={styles.buttonText}>Link Now</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5F0FF", // Soft blue
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E3A8A", // Deep blue
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#1E40AF",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderColor: "#93C5FD",
    borderWidth: 2,
    fontSize: 18,
    width: "100%",
    marginBottom: 20,
    color: "#111827",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

