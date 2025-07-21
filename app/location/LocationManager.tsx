import LiveLocationSender from "@/components/home/LiveLocationSender";
import { useLocalSearchParams } from "expo-router";
const LocationManager = ()=>{
    const bus_number:any = useLocalSearchParams();
    console.log(bus_number);
    return(<LiveLocationSender bus_number={bus_number} />)
}
export default LocationManager;