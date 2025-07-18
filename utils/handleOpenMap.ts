import { Linking } from "react-native";
const handleOpenMap = (latitude:any, longitude:any) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  Linking.openURL(url);
};
export default handleOpenMap;