import { useLocation } from "react-router-dom";
import PlugDetailsTabs from "./PlugDetailsTabs";

const PlugsDetails = (props: { token:any}) => {
    
  const location: any = useLocation();
  const plugDataState = location.state?.plugData;

  return (
    <div className="flex flex-col p-6">
      <PlugDetailsTabs plugData={plugDataState} token={props.token} />
    </div>
  );
};

export default PlugsDetails;
