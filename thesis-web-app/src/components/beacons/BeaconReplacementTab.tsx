import { History } from "history";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useHistory } from "react-router";
import DropdownMenu from "../Utils/ListBox";
import { BeaconDTO } from "../../interfaces";
import FeedbackDialog from "../Utils/FeedbackDialog";
import indoorPlan from "../../PlantaIndoor.png";
import ImageHotspots from 'react-image-hotspots'
import pinBlue from '../../marker_blue.svg'
import pinOrange from '../../marker_orange.svg'
import BeaconStatus from "./BeaconStatus";

async function changeBeaconStatusRequest(
  history: string[] | History<unknown>,
  token: string,
  beaconId: string,
  beaconStatus: boolean,
  setDialogTitle: Dispatch<SetStateAction<string>>,
  setDialogMessage: Dispatch<SetStateAction<string>>,
  setBeaconStatus: React.Dispatch<boolean>,
  setBeaconZone: React.Dispatch<number>
) {
  var myHeaders = new Headers();

  myHeaders.append("Authorization", token);

  const newBeaconState = JSON.stringify({
    desiredState: !beaconStatus,
    beaconId: beaconId,
  });

  var requestOptions: RequestInit = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
    body: newBeaconState
  };

  await fetch(
    `http://194.210.120.104:8080/beacons/state`,
    requestOptions
  )
    .then((response) => {
      if (response.ok) {
        setBeaconStatus(!beaconStatus);
        if (beaconStatus){
          setBeaconZone(0)
        }
        setDialogTitle("Success");
        setDialogMessage("Successfully changed the beacon status.");
      } else {
        setDialogTitle("Error");
        setDialogMessage("Failure to change the beacon status.");
      }
    })
    .catch((error) => {
      history.push("/");
    });
}


function getPinPosition(zone:Number){
  if (zone===1){ //pintura 1
    return  [25,11]
  }else if(zone===2){//pintura 2
    return  [37,11]
  }else if(zone===3){ //lixagem
    return  [63,27]
  }else if(zone===4){ //Jato areia
    return  [9,41]
  }else if(zone===5){ //z1
    return  [76,48]
  }else if(zone===6){ //z1
    return  [81,56]
  }else if(zone===7){ //z1
    return  [89,79]
  }else if(zone===8){ //z1
    return  [76,90]
  }else if(zone===9){ //z1
    return  [47,84]
  }else if(zone===10){ //z1
    return  [47,67]
  }else if(zone===11){ //z3
    return  [35,63]
  }else if(zone===12){ //z3
    return  [24,47]
  }else if(zone===13){ //z3
    return  [45,48]
  }else if(zone===14){ //z2
    return  [11,63]
  }else if(zone===15){ //z3 
    return  [22,32]
  }else if(zone===16){ //z3
    return  [46,40]
  }  
  else{
    return [] 
  }
}





const replaceBeaconRequest = async (
  history: History<unknown> | string[],
  token: string,
  beaconId: string,
  newBeaconPosition: number,
  setDialogTitle: Dispatch<SetStateAction<string>>,
  setDialogMessage: Dispatch<SetStateAction<string>>,
  setBeaconStatus: React.Dispatch<boolean>,
  setBeaconZone: React.Dispatch<number>
) => {
  var myHeaders = new Headers();

  myHeaders.append("Authorization", token);

  const newBeaconData = JSON.stringify({
    beaconId: beaconId,
    newPosition:newBeaconPosition
  });

  var requestOptions: RequestInit = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
    body: newBeaconData,
  };

  await fetch(
    'http://194.210.120.104:8080/beacons/replacement',
    requestOptions
  )
    .then((response) => {
      if (response.ok) {
        setBeaconStatus(true)
        setBeaconZone(newBeaconPosition)
        setDialogTitle("Success");
        setDialogMessage(`Successfully replaced beacon ${beaconId} to position ${newBeaconPosition}.`);
      } else {
        setDialogTitle("Error");
        setDialogMessage("Failure to replace the beacons.");
      }
    })
    .catch((error) => {
      history.push("/");
    });
};

export default function BeaconDetailsTab(props: { beaconData: any, token:any }) {


  const history = useHistory();
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [beaconsIds, setBeaconsIds] = useState<string[]>([]);
  const [errorRetrieving, setErrorRetrieving] = useState<boolean>(false);
  const [beaconStatus, setBeaconStatus] = useState(props.beaconData.isActive);
  const [selectedData, setSelectedData] = useState(props.beaconData.shortID);
  const [beaconZone, setBeaconZone] = useState(props.beaconData.zone);



  async function fetchPositions(token: string) {
    var myHeaders = new Headers();

    myHeaders.append("Authorization",  token);

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `http://194.210.120.104:8080/beacons/positions`,
      requestOptions
    )
      .then((response) =>
        response.ok ? response.json() : setErrorRetrieving(true)
      ).then((responses) => {
        if (!errorRetrieving) {
          responses.length === 0
            ? setBeaconsIds(["Error"])
            : setBeaconsIds(responses);
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
      fetchPositions(props.token);
    }
    // eslint-disable-next-line
  }, []);

  async function replaceBeacon() {
    if (beaconStatus){
      setDialogTitle("Error");
      setDialogMessage("Impossible to replace a Coupled beacon. Decouple the beacon first.");
      setOpenDialog(true);
    }
    else{
      if (selectedData !== props.beaconData.shortID) {
        if (!props.token){
          history.push("/");
        }else{
          await replaceBeaconRequest(
            history,
            props.token,
            props.beaconData.shortID,
            selectedData,
            setDialogTitle,
            setDialogMessage,
            setBeaconZone,
            setBeaconStatus
          );
          setOpenDialog(true);
        }
      } else {
        setDialogTitle("Error");
        setDialogMessage("Impossible to replace the beacon position.");
        setOpenDialog(true);
      }
    }
  }

  const getChildComponentData = (inputData: string | number, index: number) => {
    setSelectedData(inputData as string);
  };

  var newHotspots=[];

  for (let zone = 1; zone < 17; zone++) {
    let position=getPinPosition(zone)
    let newX=position[0]
    let newY=position[1]
    var color="#00b0fd"
    var pin=pinBlue
    if (zone==beaconZone){
      color="#ff7f7f"
      pin=pinOrange
    }
    var newHotspot= {x: newX, y: newY, content:
        <div style={{"position": "relative"}}>
          <text className="comment" style={{  padding: "3px", backgroundColor: color, borderRadius: "20px"}}> P {zone}</text>
          <img  src={pin} width="25" height="25" style={{"display": "block"}} />
        </div>
      }
    newHotspots.push(newHotspot)
  }

  function canBeReplaced(){
    if (beaconStatus){
      return <h1 className="font-bold text-lg ml-4 mr-4 text-red justify-center items-center text-center">Beacons {props.beaconData.shortID} is Coupled so it can not be replaced.</h1>
    }else{
      return ""
    }
  }

  function replaceButton(){
    
    if (beaconStatus){
      return null
    }else{
      return <button
        className="bg-green hover:bg-green-dark text-white ml-4 py-1 px-2 rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
        onClick={replaceBeacon}
      >
        Select Position & Couple Beacon
      </button>
    }
  }




  async function changeBeaconStatus() {
    if (beaconZone===0){
      setDialogTitle("Define Beacon Position");
      setDialogMessage("Beacon with no defined position. Define beacon position first.");
      setOpenDialog(true);
    }else{
      if (!props.token){
        history.push("/");
      }else{
        await changeBeaconStatusRequest(
          history,
          props.token,
          props.beaconData.shortID,
          beaconStatus,
          setDialogTitle,
          setDialogMessage,
          setBeaconStatus,
          setBeaconZone
        );
        setOpenDialog(true);
      }
    }
    
  }

  function statusButton(){
    if (!beaconStatus && beaconZone===0){
      return null
    }else{
      return <button
        className="bg-green hover:bg-green-dark text-white ml-4 py-1 px-2 rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
        onClick={changeBeaconStatus}
      >
        Decouple Beacon
      </button>
    }
  }


  return (
    <>
      <h1 className="font-semibold text-lg">Beacons Available Positions Map</h1>
      <h1 >{canBeReplaced()} </h1>
      <div className="flex flex-row p-4 mt-4"> 


        <div style={{ height: "607px"}}>
          <ImageHotspots
            src={indoorPlan}
            alt='Sample image'
            background='Red'
            hotspots={newHotspots}
          />
        </div>
        
        <div className="flex flex-col p-2">
          <div className="flex flex-row mt-4">
            <h2 className="font-semibold ml-4 mr-4 flex justify-center items-center text-center">
              Beacon Id:
            </h2>
            <div> {props.beaconData.shortID}</div>
          </div>
          <div className="flex flex-row mt-4">
            <h2 className="font-semibold ml-4 mr-4 flex justify-center items-center text-center">
              Battery Level:
            </h2>
            <div> {props.beaconData.batteryLevel}%</div>
          </div>
          <div className="flex flex-row mt-4">
            <h2 className="font-semibold ml-4 mr-4 flex justify-center items-center text-center">
              Current Beacon Position:
            </h2>
            <div> {beaconZone==0 ? "Beacon with no defined position." : beaconZone}</div>
          </div>
          <div className="flex flex-row my-2 mt-4">
            <h2 className="font-semibold flex justify-start items-center text-center ml-4 mr-4">
              Available Positions:
            </h2>
            <DropdownMenu
              
              menuContent={errorRetrieving || beaconZone!=0 ? [] : beaconsIds}
              current={errorRetrieving || beaconZone==0 ? "Choose Position" : "Beacon is coupled."}
              index={7}
              parentCallback={getChildComponentData}
            />
            <div>{replaceButton()}</div>
          </div>

          <div className="flex flex-row mt-4">
            <h2 className="font-semibold ml-4 mr-4 flex justify-center items-center text-center">
              Status:
            </h2>
            <BeaconStatus status={beaconStatus} />
          </div>
          <div className="flex flex-row mt-4">
            {statusButton()}
          </div>

        </div>
      </div>

      {openDialog && (
        <div className="flex justify-center items-center text-center">
          <FeedbackDialog
            title={dialogTitle}
            message={dialogMessage}
            closeDialog={setOpenDialog}
            nextPage={dialogTitle === "Success" ? "/beacons" : ""}
            
          />
        </div>
      )}

      {errorRetrieving && (
        <div className="flex justify-center items-center text-center">
          <FeedbackDialog
            title={"Error"}
            message={"Error retrieving beacons identifications."}
            closeDialog={setOpenDialog}
          />
        </div>
      )}
    </>
  );
}
