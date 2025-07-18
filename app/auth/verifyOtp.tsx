import DriverOtpScreen from "@/components/auth/DriverOtpScreen";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function VerifyOtp() {
    const phone_number:any= useLocalSearchParams();
    console.log(phone_number);
  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
      <DriverOtpScreen phone_number={phone_number}/>
    </View>
  );
}
