import Constants from "expo-constants";
import { io } from "socket.io-client";

const url = Constants.expoConfig?.extra?.BACKEND_URL;
const socket = io(url, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
