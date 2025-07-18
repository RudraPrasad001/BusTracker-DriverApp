
import React from "react";
import { View } from "react-native";
import DriverLoginScreen from "../components/auth/DriverLoginScreen";
export default function Index() {
  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
      <DriverLoginScreen />
    </View>
  );
}
