import Loader from "../Utils/Loader";
import { SensorBoxDTO,SensorBoxReachableDTO } from "../../interfaces";
import { Link, useHistory } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

const SensorBoxesPage = (props: { token:any, setToken: any}) => {



  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorRetrieving, setErrorRetrieving] = useState<boolean>(false);
  const [sensorBoxesCloud, setSensorBoxesCloud] = useState([] as SensorBoxDTO[]);
  const [boxesReachability, setBoxesReachability] = useState([] as SensorBoxReachableDTO[]);

  async function fetchSensorBoxes(token: string) {
    var myHeaders = new Headers();

    myHeaders.append("Authorization", token);

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      "http://194.210.120.104:8080/sensorboxes",
      requestOptions
    )
      .then((response) =>
        response.ok ? response.json() : setErrorRetrieving(true)
      )
      .then((result) => {
        setIsLoading(false);
        if (result) {
          result.length === 0
            ? setErrorRetrieving(true)
            : setSensorBoxesCloud(
                result.map((sensorBox: SensorBoxDTO) => sensorBox)
              );
        } else {
          setErrorRetrieving(true);
          setIsLoading(false)
        }
      })
      .catch((error) => {
        props.setToken(undefined)
        history.push("/");
      });
  }

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
    setIsLoading(false);
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
      console.log("Token Boxes",props.token)
      if (!props.token){
        history.push("/");
      }else{
        fetchSensorBoxes(props.token);
        fetchBoxReachability(props.token);
      }
      
   
    // eslint-disable-next-line
  }, []);

 

  //type ErrorType = { k: string; v: string };

  function checkStatus(isOn: boolean) {
    if (!isOn) {
      return (
        <div className="bg-red py-1 px-2 text-white rounded rounded-lg border-2 border-black">
          No
        </div>
      );
    }

    return (
      <div className="bg-green-dark py-1 px-2 text-white rounded rounded-lg">
        Yes
      </div>
    );
  }
 

  function isBoxReachable(idBox:String) {
    var isReachable=false
    

    console.log("idBox",idBox)
    console.log("boxesReachability",boxesReachability)
    if (boxesReachability.length>0){
      for(var i=0; i< boxesReachability.length;i++){
       
        if(boxesReachability[i].thingName===idBox){
          console.log("thingName",boxesReachability[i].thingName)
          if (boxesReachability[i].isReachable){
            return (
              <div className="bg-green-dark py-1 px-2 text-white rounded rounded-lg">
                Yes
              </div>
            );
          }
          if (boxesReachability[i].thingName==="SensorBox_03"){
            return (
              <div className="bg-green-dark py-1 px-2 text-white rounded rounded-lg">
                Yes
              </div>
            );
          }
        }
      }
    }
    return (
      <div className="bg-red py-1 px-2 text-white rounded rounded-lg border-2 border-black">
        No
      </div>
    );
    
  }

  return (
    <div className="flex flex-col p-6 w-8/12">
      <h1 className="font-semibold text-lg">System Sensor Boxes</h1>
      <div className="mt-4 bg-white rounded border border-gray-300 rounded-lg">
        <ul className="divide-y divide-gray-300">
          <div className="px-4 py-2 grid grid-cols-6 sm:gap-1 md:gap-2">
            <div className="font-semibold flex items-center">Box Name</div>
            <div className="font-semibold flex justify-center items-center text-center">
              {/* Owner */}
            </div>
            <div className="font-semibold flex justify-center items-center text-center">
              Car
            </div>
            <div className="font-semibold flex justify-center items-center text-center">
              To Record
            </div>
            <div className="font-semibold flex justify-center items-center text-center">
              Connected
            </div>
            <div></div>
          </div>
          {isLoading ? (
            <li key={""} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <div className="grid grid-cols-5 sm:gap-2 md:gap-4">
                <div className="col-span-5 flex justify-center items-center text-center">
                  <Loader />
                </div>
              </div>
            </li>
          ) : errorRetrieving ? (
            <li key={""} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <div className="grid grid-cols-5 sm:gap-2 md:gap-4">
                <div className="col-span-5 flex justify-center items-center text-center">
                  Could not find sensor boxes.
                </div>
              </div>
            </li>
          ) : (
            sensorBoxesCloud.map((sensorBox) => (
              <li
                key={sensorBox.thingName}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <Link
                  to={{
                    pathname: `/sensorboxes/${sensorBox.thingName}`,
                    state: { fromBoxesList: true, boxData: sensorBox },
                  }}
                >
                  <div className="grid grid-cols-6 sm:gap-1 md:gap-2">
                    <div className="flex items-center">
                      {sensorBox.thingName
                        ? sensorBox.thingName
                        : "NA"}
                    </div>
                    <div className="flex justify-center items-center text-center">
                      {/* {sensorBox.Coordinator
                        ? sensorBox.Coordinator
                        : "NA"} */}
                    </div>
                    <div className="flex justify-center items-center text-center">
                      {sensorBox.CarAssigned
                        ? sensorBox.CarAssigned
                        : "NA"}
                    </div>
                    <div className="flex justify-center items-center text-center">
                      {checkStatus(
                        sensorBox.IsOn
                      )}
                    </div>
                    <div className="flex justify-center items-center text-center">
                      {isBoxReachable(sensorBox.thingName)}
                    </div>

                    <div className="flex justify-center items-center text-center">
                      <button
                        className={
                          "bg-green hover:bg-green-dark text-white py-1 px-2 text-black rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
                        }
                      >
                        See Details
                      </button>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="b">  </div>
      <h1 className="font-semibold flex">Tips:
      </h1>
      <h1 className="flex">- A SensorBox is "To Record" if it should be recording. 
      </h1>
      <h1 className="flex">- It is "Connected" if is connected to the internet and can
       send data to the system.
      </h1>
    </div>
  );
};

export default SensorBoxesPage;
