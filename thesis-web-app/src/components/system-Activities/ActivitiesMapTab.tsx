//import originalPlantZones from "../../originalPlantZones.svg";
import indoorPlan from "../../PlantaIndoor.png";
import ImageHotspots from 'react-image-hotspots'
import plugIcon from '../../electric-plug-icon.svg'
import plugIconGreen from '../../electric-plug-icon Green.svg'
import './things.css';
import { useState,  useContext, useEffect} from "react";
import { ActivityDTO } from "../../interfaces";
import { useHistory } from "react-router";
import pinGreen from '../../Circle.svg'


function getPinPosition(zone:String){
  if (zone==="Painting Booth 1"){ 
    return  [21,6]
  }else if(zone==="Painting Booth 2"){
    return  [32,6]
  }else if(zone==="Sanding Zone"){ 
    return  [44,23]
  }else if(zone==="Mineral Blast Booth"){ 
    return  [6,41]
  }else if(zone==="P1"){ 
    return  [22,56]
  }else if(zone==="P2"){ 
    return  [22,49]
  }else if(zone==="P3"){ 
    return  [22,38]
  }else if(zone==="P4"){ 
    return  [22,28]
  }else if(zone==="P5"){ 
    return  [32,37]
  }else if(zone==="P6"){ 
    return  [32,49]
  }else if(zone==="P7"){ 
    return  [32,24]
  }else if(zone==="P8"){ 
    return  [62,44]
  }else if(zone==="P9"){ 
    return  [66,52]
  }else if(zone==="P10"){ 
    return  [71,60]
  }else if(zone==="P11"){ 
    return  [47,55]
  }else if(zone==="P12"){ 
    return  [46,71]
  }else if(zone==="P13"){ 
    return  [59,71]
  }else if(zone==="P14"){ 
    return  [73,71]
  }else if(zone==="P15"){ 
    return  [74,81]
  }else if(zone==="P16"){ 
    return  [59,81]
  }else if(zone==="P32"){ 
    return  [7,50]
  }else{
    return [] 
  }
}


function defineHotspots(activities:ActivityDTO[]){
  var newHotspots=[]
//  var locs=["P1","P2","P3","P4","P5","P6","P7","P8","P9","P10","P11","P12","P13","P14","P15","P16"]
  for (var i=0; i< activities.length; i++){
    let activity=activities[i];
    
    let positionFigure=getPinPosition(activity.Location)
   
    let newX=positionFigure[0]
    let newY=positionFigure[1]
    var newHotspot={ x: newX, y: newY, content:
      <button>
        <text id="a" className="replies" style={{ position: "relative", left:"20px",top:"7px",backgroundColor: "#aeaeaec4", borderRadius: "20px", padding: "3px", fontSize:"small" }}>
            {activity.BoxName}
        </text>
        <text id="b"  className="comment" style={{ position: "relative", left:"20px",top:"7px",backgroundColor: "#00871d94", borderRadius: "20px", padding: "3px", fontSize:"small"}}>
          {activity.BoxName}
        </text>
        <img  src={pinGreen} width="80" height="25" style={{"position": "relative", left:"20px"}} />

        <text id="b" className="comment" style={{ position: "absolute", top:"30%",left:"124%",backgroundColor: "#00871d94", borderRadius: "20px", padding: "3px", fontSize:"small"}}>
          {activity.CarAssigned}, {activity.Activity}, {activity.Date}, {activity.Time}  
        </text>
      </button> 
      
    }
    newHotspots.push(newHotspot);

  }  
  return newHotspots
}


export default function PlugsMapTab(props: {token:any}) {

  const [counter, setCounter] = useState<number>(0);
  const [timer, setTimer] = useState<number>(5);
  const [activities, setActivities] = useState<ActivityDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorRetrieving, setErrorRetrieving] = useState<boolean>(false);
  const history = useHistory();
  const [hotspots, setHotspots] = useState<{ x: number; y: number; content: JSX.Element; }[]>([]);

  async function fetchActivities(token: string) {
    var myHeaders = new Headers();

    myHeaders.append("Authorization",  token);

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      // `https://o3tbzwf5ek.execute-api.eu-central-1.amazonaws.com/prod/beacon/${props.beaconId}/alarms`
      `http://194.210.120.104:8080/activities`,
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
            : setActivities(result.map((activity: ActivityDTO) => activity));
        } else {
          setErrorRetrieving(true);
        }
      })
      .catch((error) => {
        history.push("/");
      });
  }

 
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCounter(counter+1);
      if (!props.token){
        history.push("/");
      }else{
        fetchActivities(props.token);
      };
      setHotspots(defineHotspots(activities))
      setTimer(5)
    },5000)
    return () => clearInterval(intervalId);
  }, [counter,hotspots]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(timer-1);
    },1000)
    return () => clearInterval(intervalId);
  }, [timer]);


  useEffect(() => {
    if (!props.token){
      history.push("/");
    }else{
      fetchActivities(props.token);
    };
  }, []);

  return (
    <>
      <h1 className="font-semibold text-lg">Live Activities in the Workshop</h1>
      <div className="flex flex-row p-4 mt-4"> 
        <div className="flex flex-col p-2">
          <ImageHotspots
            src={indoorPlan}
            alt='Sample image'
            background='Red'
            hotspots={defineHotspots(activities)}
          />
        </div>
        
          
        <div className="flex flex-col p-2">
          <h1 className="font-bold text-xl mb-2 -ml-2">Legend:</h1>
          <div className="flex flex-row">
            <h1 className="font-semibold text-lg text-green">Mouse over the green circles to get more info.</h1>
          </div>
          <div id='b'> 
          </div>
          <div id='b'> This workshop floor plan have the last received process identified by each sensor box.      
          </div>
          <div id='b'>Containing the Assigned Car, Activity Type, Date and Time of the detection.
          </div>
          <div id='b'>  --------------
          </div>
          <div id='b'>Activities detetected types can be: 
          </div>
          <div id='b'>Sanding;
          </div>
          <div id='b'>Paiting; 
          </div>
          <div id='b'>Curing; 
          </div>
          <div id='b'>Bodywork Activity. 
          </div>
          
          <div> 
          </div>
          <div className="text-md w-72 mt-4 italic">
            Next Update in = {timer}s.
          </div>

        </div>
      </div>
    </>
  );
}
