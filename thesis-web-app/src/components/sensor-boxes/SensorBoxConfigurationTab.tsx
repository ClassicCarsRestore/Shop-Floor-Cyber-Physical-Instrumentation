import { History } from "history";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import Slider from "../Utils/Slider";
import { useHistory } from "react-router";
import DropdownMenu from "../Utils/ListBox";
import { WorkerDTO } from "../../interfaces";
import FeedbackDialog from "../Utils/FeedbackDialog";




const sendShadowUpdate = async (
  history: History<unknown> | string[],
  token: string,
  //SleepTime: string,
  CarAssigned: string,
  thingName: string,
  phrase: String,
  setDialogTitle: Dispatch<SetStateAction<string>>,
  setDialogMessage: Dispatch<SetStateAction<string>>
) => {
  var myHeaders = new Headers();

  myHeaders.append("Authorization",token);

  const updatedSensorBoxData = JSON.stringify({
    //newSleepTime: SleepTime,
    newCarAssigned: CarAssigned,
    newCoordinator: "",
    sensorBoxId: thingName,
  });

  var requestOptions: RequestInit = {
    method: "PUT",
    headers: myHeaders,
    redirect: "follow",
    body: updatedSensorBoxData,
  };

  await fetch(
    'http://194.210.120.104:8080/sensorboxes/',
    requestOptions
  )
    .then((response) => {
      if (response.ok) {
        setDialogTitle("Success");
        setDialogMessage(phrase+ " Successfully updated the sensor box.");
      } else {
        setDialogTitle("Error");
        setDialogMessage("Failure to update the sensor box.");
      }
    })
    .catch((error) => {
      history.push("/");
    });
};



const sendNewCar = async (
  history: History<unknown> | string[],
  token: string,
  newCar: string,
  setDialogTitle: Dispatch<SetStateAction<string>>,
  setDialogMessage: Dispatch<SetStateAction<string>>
) => {
  var myHeaders = new Headers();

  myHeaders.append("Authorization",token);

  const newCarData = JSON.stringify({
    newCarAssigned: newCar,
  });

  var requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
    body: newCarData,
  };

  await fetch(
    'http://194.210.120.104:8080/cars',
    requestOptions
  )
    .then((response) => {
      if ("Error" in response.text) {
        setDialogTitle("Error");
        setDialogMessage("Failure to add new car.");
        history.push("/");
      } else {
        setDialogTitle("Success");
        setDialogMessage("Successfully add new car.");
      }
    })
    .catch((error) => {
      history.push("/");
    });
};

export default function ShadowConfigurationTab(props: { boxData: any , token:any}) {

  const history = useHistory();

  let initialValues = [
    //props.boxData.SleepTime,
    (props.boxData.CarAssigned as string).length !== 0
      ? (props.boxData.CarAssigned as string)
      : "",
    props.boxData.Coordinator.length !== 0
      ? props.boxData.Coordinator
      : "",
  ];

  const [workersData, setWorkersData] = useState<string[]>([]);
  const [carsData, setCarsData] = useState<string[]>([]);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedData, setSelectedData] = useState(initialValues);
  const [newCar,setNewCar]=useState("");
  const [initialCar,setinitialCar]=useState("");

  async function fetchWorkerCars(token: string) {
    var myHeaders = new Headers();

      myHeaders.append(
        "Authorization",token
      );

      var requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      

      try {
        await Promise.all([
          fetch(
            "http://194.210.120.104:8080/workers",
            requestOptions
          ).then((response) => response.json()),
          fetch(
            "http://194.210.120.104:8080/cars/database",
            requestOptions
          ).then((response) => response.json()),
        ]).then((responses) => {
          
          responses[0].length === 0
            ? setWorkersData(["Error"])
            : setWorkersData(
                responses[0].map((worker: WorkerDTO) => worker.WorkerName)
              );
          //console.log("cars respoooooooonse",responses[1])
          responses[1].length === 0
            ? setCarsData(["Error"])
            : setCarsData(responses[1]);
        });
      } catch (err) {
        history.push("/");
      }
  };

  useEffect(() => {
    if (!props.token){
      history.push("/");
    }else{
      fetchWorkerCars(props.token);
    }
    // eslint-disable-next-line
  }, []);

  const getChildComponentData = (
    inputData: number | string,
    index?: number
  ) => {
    let newState = [...selectedData];
    newState[index!] = inputData;
    setSelectedData(newState);
  };

  //console.log("selectedData",selectedData)
  const updateBoxShadow = async () => {
    if (JSON.stringify(initialValues) !== JSON.stringify(selectedData)) {
      //const SleepTime = selectedData[0]; Adicionar se for para poder configurar o sleep Time.
      const CarAssigned= selectedData[0];

      if (!props.token){
        history.push("/");
      }else{
        await sendShadowUpdate(
          history,
          props.token,
          //SleepTime,
          CarAssigned,
          props.boxData.thingName,
          "A different car was selected.",
          setDialogTitle,
          setDialogMessage
        );
        setOpenDialog(true);
      }
    } else if(initialCar!=newCar){
      if (!props.token){
        history.push("/");
      }else{
        await sendNewCar(
          history,
          props.token,
          newCar,
          setDialogTitle,
          setDialogMessage
        );
        await sendShadowUpdate(
          history,
          props.token,
          //SleepTime,
          newCar,
          props.boxData.thingName,
          "A new car was added and selected.",
          setDialogTitle,
          setDialogMessage
        );
        setOpenDialog(true);
      }
    }else {
      setDialogTitle("Alarm");
      setDialogMessage("Make some changes to update the box shadow.");
      setOpenDialog(true);
    }
  };

  return (
    <>
      <h1 className="font-semibold text-lg">Sensor Box Configuration</h1>
      <div className="flex flex-col">
        <div className="grid grid-cols-2 gap-3 pr-4">
          <div className="flex flex-row pl-4 pt-4">
            <h2 className="font-semibold mr-4">Car:</h2>
            <div className="-mt-2">
              {" "}
              <DropdownMenu
                menuContent={carsData}
                current={selectedData[0] ? selectedData[0] : "Select"}
                index={0}
                parentCallback={getChildComponentData}
              />{" "}
            </div>
            
          </div>
          <div className="flex flex-row pl-4 pt-4">
            <h2 className="font-semibold mr-4">Add new Car:</h2>{" "}
            <div className="flex flex-row -mt-2">
              <input
                id="newcar"
                type={ "text"}
                value={newCar}
                onChange={(event) =>
                  setNewCar(event.target.value)
                }
                className="w-full p-2 text-primary border rounded-md outline-none transition duration-150 ease-in-out mb-4"
                placeholder="Brand/Model/Plate"
              />
            </div>
          </div>
          <button
            className="bg-green font-semibold text-white hover:bg-green text-black rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
            onClick={updateBoxShadow}
            >
              Change Assigned Car
          </button>          
        </div>

      </div>

      {openDialog && (
        <div className="flex justify-center items-center text-center">
          <FeedbackDialog
            title={dialogTitle}
            message={dialogMessage}
            closeDialog={setOpenDialog}
            nextPage={dialogTitle === "Success" ? "/sensorboxes" : ""}
          />
        </div>
      )}
    </>
  );
};
