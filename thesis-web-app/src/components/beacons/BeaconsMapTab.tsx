//import originalPlantZones from "../../originalPlantZones.svg";
import indoorPlan from "../../PlantaIndoor.png";
import ImageHotspots from 'react-image-hotspots'
import pinRed from '../../marker_red.svg'
import pinGreen from '../../marker_green.svg'
import './things.css';


type Beacon = {
  isActive: boolean;
  shortID: string;
  zone: number;
  batteryLevel: number;
};


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







export default function BeaconsMapTab(props: { beacons: Beacon[] , token:any}) {
  var newHotspots=[]
  for (let i = 0; i < props.beacons.length; i++) {
    let isActive= props.beacons[i].isActive
    let shortId= props.beacons[i].shortID
    let battery= props.beacons[i].batteryLevel
    if (isActive) {
      var pin = null;
      var colorText=""
      if (battery > 30){
        pin=pinGreen
        colorText="#61c961"
      }else{
        pin = pinRed
        colorText="#ff5555"
      }
      let position=getPinPosition(props.beacons[i].zone)
      let newX=position[0]
      let newY=position[1]
      var newHotspot={ x: newX, y: newY, content:
        
          <button>
            <text className="comment" style={{  padding: "3px", backgroundColor: colorText, borderRadius: "20px"}}> {shortId} | Battery: {battery}%</text>
            <text className="replies" style={{  padding: "3px", backgroundColor: colorText, borderRadius: "20px" }}> {shortId.slice(0,4)}</text>
            
            <img  src={pin} width="25" height="25" style={{"display": "block"}} />
          </button>
      }
      newHotspots.push(newHotspot);
    }
  }
  function pinFunction(){
    
    return <img src={pinGreen} width="30" height="30"/>
  }
   

  return (
    <>
      <h1 className="font-semibold text-lg">Beacons Map in the Workshop</h1>
      <div className="flex flex-row p-4 mt-4"> 
        <div className="flex flex-col p-2">
          <ImageHotspots
            src={indoorPlan}
            alt='Sample image'
            background='Red'
            hotspots={newHotspots}
          />
        
        </div>
        <div className="flex flex-col p-2">
          <h1 className="font-bold text-xl mb-2 -ml-2">Legend:</h1>
          <div className="flex flex-row">
            <h1 className="font-semibold text-lg text-green">Beacons with battery over 30%:</h1>
            <h1 className="font-semibold text-lg ml-4">{pinFunction()}</h1>
          </div>
          <div className="flex flex-row">
            <h1 className="font-semibold text-lg text-red">Beacons with battery lower than 30%:</h1>
            <h1 className="font-semibold text-lg ml-4"><img src={pinRed} width="30" height="30"/></h1>
          </div>
          <div className="text-md w-72 mt-4 italic">
          This workshop floor plan have the positions of the active beacons placed in the workshop.
          The beacons positions can be changed in the "Beacons" tab.
          </div>
        </div>
      </div>
    </>
  );
}
