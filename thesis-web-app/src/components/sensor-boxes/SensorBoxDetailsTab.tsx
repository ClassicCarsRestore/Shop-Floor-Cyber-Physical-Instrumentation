import {
  useContext,useState,useEffect
} from "react";
import { useHistory } from "react-router";
import { History } from "history";
import { SensorBoxReachableDTO } from "../../interfaces";



export default function DetailsTab(props: { boxData: any , token:any}) {
  const [errorRetrieving, setErrorRetrieving] = useState<boolean>(false);
  const history = useHistory(); 
  type ErrorType = { k: string; v: string };  
  const [boxesReachability, setBoxesReachability] = useState([] as SensorBoxReachableDTO[]);

  function checkErrors(errors: ErrorType[]) {
    var errorCodes: string[] = [];
    for (var errorKey in errors) {
      if (JSON.stringify(errors[errorKey]).length > 2) {
        errorCodes.push(errorKey);
      }
    }
    return errorCodes.length === 0
      ? "No Errors"
      : "Error Codes found: " + errorCodes;
  }

  var dashboardLink= `http://194.210.120.104:3000/d/f3qQbhn4z/sensors-dahsboard`

  async function fetchBoxReachability(token: string) {
    var myHeaders = new Headers();

    myHeaders.append("Authorization", token);

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `http://194.210.120.104:8080/sensorboxes/reachable`,
      requestOptions
    )
    .then((response) =>
    response.ok ? response.json() : setErrorRetrieving(true)
  )
  .then((result) => {
    if (result) {
      result.length === 0
        ? setErrorRetrieving(true)
        : setBoxesReachability(
            result.map((sensorBox: SensorBoxReachableDTO) => sensorBox)
          );
    } else {
      setErrorRetrieving(true);
    }
  })
  .catch((error) => {
    history.push("/");
  });
  }

  useEffect(() => {
    if (!props.token){
      history.push("/");
    }else{
      fetchBoxReachability(props.token);
    }
    
    // eslint-disable-next-line
  }, []);


  function isBoxReachable(){
    if (props.boxData.thingName==="SensorBox_03"){
      return  <div className="flex flex-row mb-4">
      <h2 className="font-semibold mr-4 flex justify-center items-center text-center">
        Connected:
      </h2>
      <h2 className="font-semibold mr-4 flex justify-center items-center text-center">
         {"Yes"}
      </h2>
      </div>
    }
    if (boxesReachability.length>0){
      for(var i=0; i< boxesReachability.length;i++){

        if(boxesReachability[i].thingName===props.boxData.thingName){
          return  <div className="flex flex-row mb-4">
                <h2 className="font-semibold mr-4 flex justify-center items-center text-center">
                  Connected:
                </h2>
                <h2 className="font-semibold mr-4 flex justify-center items-center text-center">
                   {boxesReachability[i].isReachable ? "Yes" : "No. Verify Sensor Box & its Internet Connection!"}
                </h2>
              </div>
        }
      }
    }
  }

  function isVibrationReachable(){
    if (props.boxData.thingName==="SensorBox_03"){
      return  <div className="flex flex-row mb-4">
            <h2 className="font-semibold mr-4 flex justify-center items-center text-center">
              Vibration Sensor Connected:
            </h2>
            <h2 className="font-semibold mr-4 flex justify-center items-center text-center">
                {"Yes"}
            </h2>
          </div>
    }

    if (boxesReachability.length>0){
      for(var i=0; i< boxesReachability.length;i++){
        if(boxesReachability[i].thingName===props.boxData.thingName){
          return  <div className="flex flex-row mb-4">
                <h2 className="font-semibold mr-4 flex justify-center items-center text-center">
                  Vibration Sensor Connected:
                </h2>
                <h2 className="font-semibold mr-4 flex justify-center items-center text-center">
                    {!boxesReachability[i].isReachable ?"Can not verify vibration sensor connection while the sensor box is not conneted...": boxesReachability[i].vibError ? "No. Verify vibration sensor connection to sensor box!":"Yes"}
                </h2>
              </div>
        }
      }
    }
  }
   
    
    
    
  

  return (
    <>
      <h1 className="font-semibold text-lg">Sensor Box Details</h1>

      <div className="flex flex-col m-4">
        <div className="flex flex-row mb-4">
          <h2 className="font-semibold mr-4 flex justify-center items-center text-center">
            Box Name:
          </h2>
          <div> {props.boxData.thingName.toString()}</div>
        </div>
        <div className="flex flex-row mb-4">
          <h2 className="font-semibold mr-4 flex justify-center items-center text-center">
            To Record:
          </h2>
          <div> {props.boxData.IsOn ? "Yes" : "No"}</div>
        </div>
        {isBoxReachable()}
        {isVibrationReachable()}
        <div className="flex flex-row mb-4">
          <h2 className="font-semibold mr-4 flex justify-center items-center text-center">
            Car Assigned:
          </h2>
          <div>
            {" "}
            {props.boxData.CarAssigned
              ? props.boxData.CarAssigned
              : "NA"}
          </div>
        </div>
        {/* <div className="flex flex-row mb-4">
          <h2 className="font-semibold mr-4 flex justify-center items-center text-center">
            --------------------------------------
          </h2>
        </div>
        <div className="flex flex-row mb-4">
          <a href={dashboardLink} target="_blank">
              <button 
                className="bg-green hover:bg-green-dark text-white py-1 px-2 text-black rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"> 
                Monitoring Dashboard
              </button>
          </a>
        </div>
        <div className="flex flex-row mb-4">
          <h2 className="font-semibold mr-2 flex justify-center items-center text-center">
          Username:
          </h2>
          visitor
          <h2 className="font-semibold  px-3  flex justify-center items-center text-center">
          Password:
          </h2>
          guest
        </div> */}
      </div>
    </>
  );
}
