import SensorBoxTabs from "./SensorBoxTabs";
import { useLocation } from "react-router-dom";

const SensorBoxDetails = (props: { token:any}) => {
  const location: any = useLocation();
  const boxLinkState = location.state?.boxData;

  return (
    <div className="flex flex-col p-6">
      <SensorBoxTabs boxData={boxLinkState} token={props.token} />
    </div>
  );
};

export default SensorBoxDetails;
