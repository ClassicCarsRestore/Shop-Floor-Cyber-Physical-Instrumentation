import { useLocation } from "react-router-dom";
import BeaconDetailsTabs from "./BeaconDetailsTabs";

const BeaconsDetails = (props: { token:any}) => {
    
  const location: any = useLocation();
  const beaconDataState = location.state?.beaconData;

  return (
    <div className="flex flex-col p-6">
      <BeaconDetailsTabs beaconData={beaconDataState} token={props.token} />
    </div>
  );
};

export default BeaconsDetails;
