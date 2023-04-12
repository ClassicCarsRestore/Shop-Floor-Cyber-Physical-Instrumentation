import { History } from "history";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { saveAs } from "file-saver";
import Loader from "../Utils/Loader";
import { useHistory } from "react-router";
import ReactPaginate from "react-paginate";
import FeedbackDialog from "../Utils/FeedbackDialog";

const downloadFileRequest = async (
  history: string[] | History<unknown>,
  token: string,
  fileName: string,
  dialogTitle: string,
  setDialogTitle: Dispatch<SetStateAction<string>>
) => {
  var myHeaders = new Headers();

  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  await fetch(
    //`https://o3tbzwf5ek.execute-api.eu-central-1.amazonaws.com/prod/sensorbox/${boxId}/file`,
    `http://194.210.120.104:8080/inferences/blob?filename=${fileName}`,
    requestOptions
  )
    .then((response) =>
      response.ok ? response.json() : setDialogTitle("Error")
    )
    .then((result) => {
      if (dialogTitle !== "Error") {
        // saving content as a file
        const blob = new Blob([JSON.stringify(result)], {
          type: "text/plain;charset=utf-8",
        });
        saveAs(blob, `${fileName}`);
      }
    })
    .catch((error) => {
      history.push("/");
    });
};

export default function InferencesTab(props: { boxId: string , token:any }) {

  const history = useHistory();
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorRetrieving, setErrorRetrieving] = useState<boolean>(false);
  const [sensorBoxInferenceFiles, setSensorBoxInferenceFiles] = useState<string[]>([]);

  const itemsPerPage = 10;
  const itemsVisited = pageNumber * itemsPerPage;

  const displayInferenceFiles = sensorBoxInferenceFiles
    .slice(itemsVisited, itemsVisited + itemsPerPage)
    .map((inferenceFileName) => {
      return (
        <li
          key={inferenceFileName}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
        >
          <div className="grid grid-cols-4 sm:gap-1 md:gap-2">
            <div className="flex items-center col-span-2">
              {inferenceFileName ? inferenceFileName : "NA"}
            </div>
            <div className="flex justify-center items-center text-center">
              {inferenceFileName ? getInferenceFileDate(inferenceFileName) : "NA"}
            </div>
            <div className="flex justify-center items-center text-center">
              <button
                className="bg-green hover:bg-green-dark text-white py-1 px-2 text-black rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
                onClick={() => downloadFile(inferenceFileName)}
              >
                Download File
              </button>
            </div>
          </div>
        </li>
      );
    });

  interface PageProps {
    selected: number;
  }
  const changePage = ({ selected }: PageProps) => {
    setPageNumber(selected);
  };

  function getInferenceFileDate(fileName: string) {
    const fileSplit = fileName.split(".")[0].split("_").reverse();
    if (fileSplit.length === 7)
      return fileSplit[2] + "/" + fileSplit[1] + "/" + fileSplit[0];
    else return fileSplit[3] + "/" + fileSplit[2] + "/" + fileSplit[1];
  }

  async function fetchSensorBoxInferenceFileNames(token: string) {
    var myHeaders = new Headers();

    myHeaders.append("Authorization", token);

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `http://194.210.120.104:8080/inferences?boxId=${props.boxId}`,  
      requestOptions
    )
      .then((response) =>
        response.ok ? response.json() : setErrorRetrieving(true)
      )
      .then((result) => {
        setIsLoading(false);
        if (result) {
          result.length === 0 // need to access the result and see all logFileNames
            ? setErrorRetrieving(true)
            : setSensorBoxInferenceFiles(
                result.map((inferenceFileName: string) => inferenceFileName)
                
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
      fetchSensorBoxInferenceFileNames(props.token);
    }
    // eslint-disable-next-line
  }, []);

  async function downloadFile(inferenceFileName: string) {
    if (!props.token){
      history.push("/");
    }else{
      await downloadFileRequest(
        history,
        props.token,
        inferenceFileName,
        dialogTitle,
        setDialogTitle
      );
      if (dialogTitle === "Error") {
        setDialogMessage("Failure to download the inference file.");
        setOpenDialog(true);
      }
    }

  }

  return (
    <>
      <h1 className="font-semibold text-lg">Sensor Box Inferences</h1>

      <div className="mt-4 bg-white rounded border border-gray-300 rounded-lg">
        <ul className="divide-y divide-gray-300">
          <div className="px-4 py-2 grid grid-cols-4  sm:gap-1 md:gap-2">
            <div className="font-semibold col-span-2">File Name</div>
            <div className="font-semibold flex justify-center items-center text-center">
              Date
            </div>
          </div>
          {isLoading ? (
            <li key={""} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <div className="grid grid-cols-6 sm:gap-2 md:gap-4">
                <div className="col-span-6 flex justify-center items-center text-center">
                  <Loader />
                </div>
              </div>
            </li>
          ) : errorRetrieving ? (
            <li key={""} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <div className="grid grid-cols-6 sm:gap-2 md:gap-4">
                <div className="col-span-6 flex justify-center items-center text-center">
                  This sensor box has no inference files.
                </div>
              </div>
            </li>
          ) : (
            displayInferenceFiles
          )}
        </ul>
      </div>
      {!isLoading &&
        !errorRetrieving &&
        sensorBoxInferenceFiles.length > itemsPerPage && (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(sensorBoxInferenceFiles.length / itemsPerPage)}
            onPageChange={changePage}
            containerClassName="w-full relative bottom-0 right-0 h-8 list-none flex justify-end items-center ml-4 mt-4"
            previousLinkClassName="bg-green text-white font-semibold p-2 m-3 rounded rounded-lg"
            nextLinkClassName="bg-green text-white font-semibold p-2 ml-3 mr-4 rounded rounded-lg"
            activeClassName="rounded rounded-lg border border-green p-2 m-3 font-bold m-1"
            pageRangeDisplayed={5}
            marginPagesDisplayed={3}
          />
        )}

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
