import { History } from "history";
import { useHistory } from "react-router";
import FeedbackDialog from "../Utils/FeedbackDialog";
import { Dispatch, SetStateAction, useContext, useState } from "react";

const turnOnOffSensorBox = async (
  history: string[] | History<unknown>,
  boxIsOn: boolean,
  setBoxIsOn: Dispatch<SetStateAction<boolean>>,
  token: string,
  thingName: string,
  setDialogTitle: Dispatch<SetStateAction<string>>,
  setDialogMessage: Dispatch<SetStateAction<string>>
) => {

  var myHeaders = new Headers();

  myHeaders.append("Authorization",  token);

  const newSensorBoxState = JSON.stringify({
    desiredState: !boxIsOn,
    sensorBoxId: thingName,
  });

  var requestOptions: RequestInit = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
    body: newSensorBoxState
  };


  await fetch(
    `http://194.210.120.104:8080/sensorboxes/state`,
    requestOptions
  )
    .then((response) => {
      if (response.ok) {
        setDialogTitle("Success");
        setDialogMessage("Successfully change sensor box state.");
        setBoxIsOn(!boxIsOn)
      } else {
        setDialogTitle("Error");
        setDialogMessage("Failure to change sensor box state.");
      }
    })
    .catch((error) => {
      history.push("/");
    });
};

const deleteSensorBox = async (
  history: string[] | History<unknown>,
  token: string,
  thingName: string,
  setDialogTitle: Dispatch<SetStateAction<string>>,
  setDialogMessage: Dispatch<SetStateAction<string>>
) => {
  var myHeaders = new Headers();

  myHeaders.append("Authorization", token);

  var requestOptions: RequestInit = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  await fetch(
    `http://194.210.120.104:8080/sensorboxes?thingname=${thingName}`,
    requestOptions
  )
    .then((response) => {
      if (response.ok) {
        setDialogTitle("Success");
        setDialogMessage("Successfully deleted the sensor box.");
      } else {
        setDialogTitle("Error");
        setDialogMessage("Failure to delete the sensor box.");
      }
    })
    .catch((error) => {
      history.push("/");
    });
};

export default function SensorBoxOnOffControl(props: { boxData: any  , token:any  }) {

  const history = useHistory();
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [boxIsOn, setBoxIsOn] = useState(props.boxData.IsOn);

  async function handleTurnBoxOnOff() {

    if (!props.token){
      history.push("/");
    }else{    
      await turnOnOffSensorBox(
        history,
        boxIsOn,
        setBoxIsOn,
        props.token,
        props.boxData.thingName,
        setDialogTitle,
        setDialogMessage,
      );
      setOpenDialog(true);
    }
  }

  async function handleDeleteBox() {

    if (!props.token){
      history.push("/");
    }else{ 
      await deleteSensorBox(
        history,
        props.token,
        props.boxData.thingName,
        setDialogTitle,
        setDialogMessage
      );
      setOpenDialog(true);
      }
  }

  return (
    <>
      <div className="flex flex-row gap-6 ml-12">
        {boxIsOn ? (
          <div className="flex justify-center items-center text-center">
            <button
              className={
                "bg-red hover:bg-red-dark text-white py-1 px-2 text-black rounded rounded-lg border border-red focus:outline-none focus:border-red-dark"
              }
              onClick={handleTurnBoxOnOff}
            >
              Stop Recording
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center text-center">
            <button
              className={
                "bg-green hover:bg-green-dark text-white py-1 px-2 text-black rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
              }
              onClick={handleTurnBoxOnOff}
            >
              Start Recording
            </button>
          </div>
        )}

        {/* {boxIsOn ? (
          boxCodeIsRunning ? (
            <div className="flex justify-center items-center text-center">
              <button
                className={
                  "bg-red hover:bg-red-dark text-white py-1 px-2 text-black rounded rounded-lg border border-red focus:outline-none focus:border-red-dark"
                }
                //onClick={handleStartStopScript}
              >
                Stop Recording
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center text-center">
              <button
                className={
                  "bg-green hover:bg-green-dark text-white py-1 px-2 text-black rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
                }
                //onClick={handleStartStopScript}
              >
                Start Recording
              </button>
            </div>
          )
        ) : (
          <></>
        )} */}

        <div className="flex justify-center items-center text-center">
          {/* <button
            className={
              "bg-red-dark hover:bg-red-darker text-white py-1 px-2 text-black font-semibold rounded rounded-lg border border-red focus:outline-none focus:border-red-darker"
            }
            onClick={handleDeleteBox}
          >
            Delete Box
          </button> */}
        </div>
      </div>

      {openDialog && (
        <div className="flex justify-center items-center text-center">
          <FeedbackDialog
            title={dialogTitle}
            message={dialogMessage}
            closeDialog={setOpenDialog}
            nextPage={"/sensorboxes"}
          />
        </div>
      )}
    </>
  );
}
