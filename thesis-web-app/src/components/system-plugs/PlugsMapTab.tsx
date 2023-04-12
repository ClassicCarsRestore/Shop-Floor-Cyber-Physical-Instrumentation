//import originalPlantZones from "../../originalPlantZones.svg";
import indoorPlan from "../../PlantaIndoor.png";
import ImageHotspots from 'react-image-hotspots'
import plugIcon from '../../electric-plug-icon.svg'
import plugIconGreen from '../../electric-plug-icon Green.svg'
import './things.css';


type Plug = {
  shortID: string;
  isActive: boolean;
  position: number
};


function getPinPosition(zone:Number){
  if(zone===1){
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


  } else if(zone===20){ 
      return  [9,11]
  } else if(zone===21){ 
      return  [9,6]
  }else if(zone===22){ 
    return  [9,51]
}else{
    return [] 
  }
}



export default function PlugsMapTab(props: { plugs: Plug[], token:any}) {
  var newHotspots=[]
  for (let i = 0; i < props.plugs.length; i++) {
    let isActive= props.plugs[i].isActive
    let shortId= props.plugs[i].shortID
    
    var pin = null;
    var colorText=""
    
    pin=plugIcon
    colorText="#00b0fd"
    var degrees="0"

    let position=getPinPosition(props.plugs[i].position)
    if(props.plugs[i].position==20 || props.plugs[i].position==21 || props.plugs[i].position==22){
      pin=plugIconGreen
      colorText="#1eab00"
      degrees="90"
    }
    let newX=position[0]
    let newY=position[1]
    if ( shortId.includes("3EM")){
      var newHotspot={ x: newX, y: newY, content:
      
        <button>
          {/* <text className="comment" style={{  padding: "3px", backgroundColor: colorText, borderRadius: "20px"}}> {shortId}</text> */}
          <text style={{ position:"relative",  padding: "3px", backgroundColor: colorText, borderRadius: "20px",right:"48px", top:"26px"}}> {shortId}</text>
          
          <img  src={pin} width="20" height="20" style={{"transform":"rotate("+degrees+"deg)", "display": "block",  marginLeft:"71px"}} />
        </button>
      }
    }else{
      var newHotspot={ x: newX, y: newY, content:
      
        <button>
          {/* <text className="comment" style={{  padding: "3px", backgroundColor: colorText, borderRadius: "20px"}}> {shortId}</text> */}
          <text style={{ position:"relative",  padding: "3px", backgroundColor: colorText, borderRadius: "20px",right:"48px", top:"26px"}}> {shortId.slice(0,5)}</text>
          
          <img  src={pin} width="20" height="20" style={{"transform":"rotate("+degrees+"deg)","display": "block"}} />
        </button>
        
      
      }
    }
    newHotspots.push(newHotspot);
  }



  return (
    <>
      <h1 className="font-semibold text-lg">Energy Meters Map in the Workshop</h1>
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
            <h1 className="font-semibold text-lg text-blue">Shelly Plug's S:</h1>
            <h1 className="font-semibold text-lg ml-4"><img src={plugIcon} width="20" height="20" /></h1>
          </div>
          <div className="flex flex-row">
            <h1 className="font-semibold text-lg text-#36db13"  style={{"color":"#1eab00"}}>Shelly 3EM:</h1>
            <h1 className="font-semibold text-lg ml-4"><img src={plugIconGreen} width="20" height="20" style={{"transform":"rotate(90deg)"}}/></h1>
          </div>
          <div className="text-md w-72 mt-4 italic">
            This workshop floor plan have the positions of the smart plugs (Blue) and smart meters (Green) placed in the workshop. 
            The smart plugs (Blue) positions can be changed in the "Energy Meters" tab.
          </div>
        </div>
      </div>
    </>
  );
}
