import getInfo from "@/utils/getToken";
import handleOpenMap from "@/utils/handleOpenMap";
import axios from "axios";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const Details = () => {
  const { number_plate } = useLocalSearchParams();
  const url = Constants.expoConfig?.extra?.BACKEND_URL;
  const [busData, setBusData] = useState<any>(null);
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const driverData = await getInfo();
      setDriver(driverData);
      console.log(url);
      const res = await axios.get(`${url}/get/bus/${number_plate}`);
      if (res.data.success) {
        setBusData(res.data.bus);
      }
    } catch (error) {
      console.error("Error fetching bus details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.containerCenter}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Driver Dashboard</Text>
      <Text style={styles.info}>👤 Driver: {driver?.name}</Text>
      <Text style={styles.info}>🚌 Bus ID: {busData?.bus_id}</Text>
      <Text style={styles.info}>📍 Route: {busData?.route_name}</Text>
      <Text style={styles.info}>🚌 Bus Number Plate: {busData?.number_plate}</Text>

      <Text style={styles.subheader}>Route Flow</Text>
      <ScrollView style={styles.scroll}>
        {busData?.stops?.map((stop: any, idx: number) => (
          <View key={stop.stop_id}>
            <TouchableOpacity 
                key={stop.stop_id} 
                style={styles.stopItem}
                onPress={() => handleOpenMap(stop.latitude, stop.longitude)}
            >
                <Text style={styles.stopText}>
                    {idx + 1}. {stop.stop_name}
                </Text>
                <Text style={styles.coord}>
                    🧭 ({stop.latitude}, {stop.longitude})
                </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.buttonFake} onPress={()=>Alert.alert("Work","Need to Work on it")}>
        <Text style={styles.buttonText}>Start Sharing Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5F0FF",
    padding: 24,
    paddingTop: 40,
  },
  containerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E5F0FF",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: "#1E40AF",
    marginBottom: 6,
  },
  subheader: {
    fontSize: 25,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#1E3A8A",
  },
  scroll: {
    flex: 1,
    marginBottom: 16,
  },
  stopItem: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  stopText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#1E3A8A",
  },
  coord: {
    fontSize: 12,
    color: "#475569",
  },
  buttonFake: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});