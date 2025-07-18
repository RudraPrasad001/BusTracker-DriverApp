import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

const getInfo = async()=>{
const token = await AsyncStorage.getItem("token");
console.log("WORJK");
if(typeof token ==='string'){
    const decoded = jwtDecode(token);
    return decoded;
}
return null;
}
export default getInfo;
