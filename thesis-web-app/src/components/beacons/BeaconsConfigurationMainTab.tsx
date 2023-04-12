import { History } from "history";
import Slider from "../Utils/Slider";
import { useHistory } from "react-router";
import FeedbackDialog from "../Utils/FeedbackDialog";
import { Dispatch, SetStateAction, useContext, useState } from "react";


async function updateBeaconsBatteryLevel(
  history: string[] | History<unknown>,
  token: string,
  batteryLevel: number,
  setDialogTitle: Dispatch<SetStateAction<string>>,
  setDialogMessage: Dispatch<SetStateAction<string>>
) {
  var myHeaders = new Headers();

  myHeaders.append("Authorization", token);

  var requestOptions: RequestInit = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
  };

  await fetch(
    `http...`,
    requestOptions
  )
    .then((response) => {
      if (response.ok) {
        setDialogTitle("Success");
        setDialogMessage("Successfully updated the beacons battery level.");
      } else {
        setDialogTitle("Error");
        setDialogMessage("Failure to update the beacons battery level.");
      }
    })
    .catch((error) => {
      history.push("/");
    });
}

export default function BeaconsConfiguration(props: { token:any}) {
  
  const history = useHistory();

  const [batteryLevel, setBatteryLevel] = useState(0);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  async function updateBeaconMinimumBatteryLevel() {
    if (!props.token){
      history.push("/");
    }else{
      await updateBeaconsBatteryLevel(
        history,
        props.token,
        batteryLevel,
        setDialogTitle,
        setDialogMessage
      );
      setOpenDialog(true);
    }
  }

  const getBatteryLevelSelection = (batteryLevel: number | string) => {
    setBatteryLevel(batteryLevel as number);
  };

  return (
    <>
      <h1 className="font-semibold text-lg">
        Beacons Battery Level Configuration
      </h1>
      <h1 className="font-semibold text-lg">
       - Talvez tirar, pois se os alarmes vierem do Influx, e complexo variar o treshold
      </h1>
      

      <div className="flex flex-row justify-center items-center m-4">
        <div className="grid grid-cols-2 gap-3 pr-4">
          <div className="flex flex-row pl-4 pt-4 ">
            
            <h2 className="font-semibold mr-6">
              Select beacon minimum battery level: N USADO POR ENQUANTO!
            </h2>
            <div className="-mt-2">
              {" "}
              <Slider
                minimum={0}
                maximum={100}
                stepNumber={1}
                current={0}
                parentCallback={getBatteryLevelSelection}
              />{" "}
            </div>
          </div>
          <div className="pl-10 mt-3">
            {/* <button
              className="bg-green hover:bg-green-dark text-white py-1 px-2 rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
              onClick={updateBeaconMinimumBatteryLevel}
            >
              Apply Changes
            </button> */}
          </div>
        </div>
      </div>

      {openDialog && (
        <div className="flex justify-center items-center text-center">
          <FeedbackDialog
            title={dialogTitle}
            message={dialogMessage}
            closeDialog={setOpenDialog}
          />
        </div>
      )}
    </>
  );
}
