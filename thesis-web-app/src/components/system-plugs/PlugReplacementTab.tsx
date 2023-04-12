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
import FeedbackDialog from "../Utils/FeedbackDialog";
import indoorPlan from "../../PlantaIndoor.png";
import ImageHotspots from 'react-image-hotspots'
import pinBlue from '../../marker_blue.svg'
import pinOrange from '../../marker_orange.svg'
import PlugStatus from "./PlugStatus";
import plugIconBlue from '../../electric-plug-icon.svg'
import plugIconRed from '../../electric-plug-icon Red.svg'

async function changePlugStatusRequest(
  history: string[] | History<unknown>,
  token: string,
  plugId: string,
  plugStatus: boolean,
  setDialogTitle: Dispatch<SetStateAction<string>>,
  setDialogMessage: Dispatch<SetStateAction<string>>,
  setPlugStatus: React.Dispatch<boolean>,
  setPlugPosition: React.Dispatch<number>
) {
  var myHeaders = new Headers();

  myHeaders.append("Authorization", token);

  const newPlugState = JSON.stringify({
    desiredState: plugStatus,
    plugId: plugId,
  });

  var requestOptions: RequestInit = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
    body: newPlugState
  };

  await fetch(
    `http://194.210.120.104:8080/plugs/state`,
    requestOptions
  )
    .then((response) => {
      if (response.ok) {
        //setPlugStatus(!plugStatus);
        
        setPlugPosition(0)
        
        setDialogTitle("Success");
        setDialogMessage("Successfully changed the plug status.");
      } else {
        setDialogTitle("Error");
        setDialogMessage("Failure to change the plug status.");
      }
    })
    .catch((error) => {
      history.push("/");
    });
}


function getPinPosition(zone:Number){
  if (zone===1){
    return  [44,34]
  }else if(zone===2){ 
    return  [61,28]
  }else if(zone===3){ 
    return  [44,41]
  }else if(zone===4){ 
    return  [44,49]
  }else if(zone===5){ 
    return  [44,57]
  }else if(zone===6){ 
    return  [25.5,33]
  }else{
    return [] 
  }
}





const replacePlugRequest = async (
  history: History<unknown> | string[],
  token: string,
  plugId: string,
  newPlugPosition: number,
  setDialogTitle: Dispatch<SetStateAction<string>>,
  setDialogMessage: Dispatch<SetStateAction<string>>,
  setPlugStatus: React.Dispatch<boolean>,
  setPlugPosition: React.Dispatch<number>
) => {
  var myHeaders = new Headers();

  myHeaders.append("Authorization",  token);

  const newPlugData = JSON.stringify({
    plugId: plugId,
    newPosition:newPlugPosition
  });

  var requestOptions: RequestInit = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
    body: newPlugData,
  };

  await fetch(
    'http://194.210.120.104:8080/plugs/replacement',
    requestOptions
  )
    .then((response) => {
      if (response.ok) {
        setPlugPosition(newPlugPosition)
        setDialogTitle("Success");
        if (newPlugPosition==0){
          setDialogMessage(`Successfully unplaced plug ${plugId}.`);
        }else{
          setDialogMessage(`Successfully replaced plug ${plugId} to position ${newPlugPosition}.`);
        }
        
      } else {
        setDialogTitle("Error");
        setDialogMessage("Failure to replace the plugs.");
      }
    })
    .catch((error) => {
      history.push("/");
    });
};

export default function PlugDetailsTab(props: { plugData: any , token:any}) {


  const history = useHistory();
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [plugsIds, setPlugsIds] = useState<string[]>([]);
  const [errorRetrieving, setErrorRetrieving] = useState<boolean>(false);
  const [plugStatus, setPlugStatus] = useState(props.plugData.isActive);
  const [selectedData, setSelectedData] = useState(props.plugData.shortID);
  const [plugPosition, setPlugPosition] = useState(props.plugData.position);


  async function fetchPositions(token: string) {
    var myHeaders = new Headers();

    myHeaders.append("Authorization",  token);

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `http://194.210.120.104:8080/plugs/positions`,
      requestOptions
    )
      .then((response) =>
        response.ok ? response.json() : setErrorRetrieving(true)
      ).then((responses) => {
        if (!errorRetrieving) {
          responses.length === 0
            ? setPlugsIds([])
            : setPlugsIds(responses);
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

  async function replacePlug() {
    if (selectedData !== props.plugData.shortID) {
      
      if (!props.token){
        history.push("/");
      }else{
        await replacePlugRequest(
          history,
          props.token,
          props.plugData.shortID,
          selectedData,
          setDialogTitle,
          setDialogMessage,
          setPlugPosition,
          setPlugStatus
        );
        setOpenDialog(true);
      }
    } else {
      setDialogTitle("Error");
      setDialogMessage("Impossible to replace the plug position.");
      setOpenDialog(true);
    }
    
  }

  const getChildComponentData = (inputData: string | number, index: number) => {
    setSelectedData(inputData as string);
  };

  var newHotspots=[];

  for (let zone = 1; zone < 15; zone++) {
    let position=getPinPosition(zone)
    let newX=position[0]
    let newY=position[1]
    var color="#00b0fd"
    var pin=plugIconBlue
    if (zone==plugPosition){
      color="#ff7f7f"
      pin=plugIconRed
    }
    var newHotspot= {x: newX, y: newY, content:
        <div style={{"position": "relative"}}>
          <text className="comment" style={{  position:"relative",  padding: "3px", backgroundColor: color, borderRadius: "20px",right:"31px", top:"26px"}}> P {zone}</text>
          <img  src={pin} width="20" height="20" style={{"display": "block"}} />
        </div>
      }
    newHotspots.push(newHotspot)
  }

  function replaceButton(){
    return <button
      className="bg-green hover:bg-green-dark text-white ml-4 py-1 px-2 rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
      onClick={replacePlug}
    >
      Change Meter Position
    </button>
    
  }




  async function unplacePlug() {
    if (plugPosition===0){
      setDialogTitle("Define Plug Position");
      setDialogMessage("Plug with no defined position. Define plug position first.");
      setOpenDialog(true);
    }else{
      if (!props.token){
        history.push("/");
      }else{
        await replacePlugRequest(
          history,
          props.token,
          props.plugData.shortID,
          0,
          setDialogTitle,
          setDialogMessage,
          setPlugPosition,
          setPlugStatus
        );
        setOpenDialog(true);
      }
    }
    
  }

  function statusButton(){
    if (plugPosition===0){
      return null
    }else{
      return <button
        className="bg-green hover:bg-green-dark text-white ml-4 py-1 px-2 rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
        onClick={unplacePlug}
      >
        Unplace Meter
      </button>
    }
  }


  return (
    <>
      <h1 className="font-semibold text-lg">Energy Meters Available Postions Map</h1>
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
              Meter Id:
            </h2>
            <div> {props.plugData.shortID}</div>
          </div>
          <div className="flex flex-row mt-4">
            <h2 className="font-semibold ml-4 mr-4 flex justify-center items-center text-center">
              Current Meter Position:
            </h2>
            <div> {plugPosition==0 ? "Plug with no defined position." : plugPosition}</div>
          </div>
          <div className="flex flex-row my-2 mt-4">
            <h2 className="font-semibold flex justify-start items-center text-center ml-4 mr-4">
              Available Positions:
            </h2>
            <DropdownMenu
              menuContent={plugsIds.length==0 ? [] : plugsIds }
              current={"Choose new position"}
              index={7}
              parentCallback={getChildComponentData}
            />
            <div>{replaceButton()}</div>
          </div>

          <div className="flex flex-row mt-4">
            <h2 className="font-semibold ml-4 mr-4 flex justify-center items-center text-center">
              Connected:
            </h2>
            <PlugStatus status={plugStatus} />
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
            nextPage={dialogTitle === "Success" ? "/plugs" : ""}
            
          />
        </div>
      )}

      {errorRetrieving && (
        <div className="flex justify-center items-center text-center">
          <FeedbackDialog
            title={"Error"}
            message={"Error retrieving plugs identifications."}
            closeDialog={setOpenDialog}
          />
        </div>
      )}
    </>
  );
}
