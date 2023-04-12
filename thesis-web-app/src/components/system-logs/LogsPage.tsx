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
import { SystemLogDTO } from "../../interfaces";
import FeedbackDialog from "../Utils/FeedbackDialog";

function containsLogFileNames(
  result: { BoxName: string; LogFileNames: string[] }[]
): boolean {
  return (
    result.filter((item) => {
      return item.LogFileNames.length > 0;
    }).length > 0
  );
}

function parseLogs(logsData: { BoxName: string; LogFileNames: string[] }[]) {
  var output: string[] = [];
  for (const entry of logsData) {
    if (entry.LogFileNames.length > 0) output = [...entry.LogFileNames];
  }
  return output;
}

// const downloadFileRequest = async (
//   history: string[] | History<unknown>,
//   token: string,
//   filePath: string,
//   dialogTitle: string,
//   setDialogTitle: Dispatch<SetStateAction<string>>,
//   setDialogMessage: Dispatch<SetStateAction<string>>,
//   setOpenDialog: Dispatch<SetStateAction<boolean>>
// ) => {
//   var myHeaders = new Headers();

//   myHeaders.append("Authorization", "Bearer " + token);
//   myHeaders.append("Content-Type", "application/json");

//   var requestOptions: RequestInit = {
//     method: "PUT",
//     headers: myHeaders,
//     redirect: "follow",
//     body: filePath,
//   };

//   await fetch(
//     `http...`,
//     requestOptions
//   )
//     .then((response) =>
//       response.ok ? response.json() : setDialogTitle("Error")
//     )
//     .then((result) => {
//       if (result) {
//         if (dialogTitle !== "Error") {
//           // saving content as a file
//           const blob = new Blob([result.fileData.toString()], {
//             type: "text/plain;charset=utf-8",
//           });
//           saveAs(blob, `${result.fileName.split("/")[2].split(".")[0]}.txt`);
//         }
//       } else {
//         setDialogTitle("Error");
//         setDialogMessage("Failure to download the log file.");
//         setOpenDialog(true);
//       }
//     })
//     .catch((error) => {
//       history.push("/");
//     });
// };


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

  console.log(fileName)

  await fetch(
    `http://194.210.120.104:8080/logs/blob?filename=${fileName}`,
    requestOptions
  )
    .then(async (response) =>
      response.ok  ? await response.blob() : setDialogTitle("Error")
    )
    .then((result) => {
      if (dialogTitle !== "Error" && result!=null) {
        console.log(result)
        // saving content as a file
        // const blob = new Blob( [JSON.stringify(result[0])], {
        //   type: "text/plain;charset=utf-8",
        // });
        saveAs(result, `${fileName}`);
      }
    })
    .catch((error) => {
      history.push("/");
    });
};

const LogsPage = (props: { token:any}) => {

  const history = useHistory();
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorRetrieving, setErrorRetrieving] = useState<boolean>(false);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const itemsPerPage = 10;
  const itemsVisited = pageNumber * itemsPerPage;

  console.log("Logs Token ",props.token)

  const displayLogFiles =  systemLogs
    .slice(itemsVisited, itemsVisited + itemsPerPage)
    .map((logFileName) => {
      return (
        <li
          key={logFileName}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
        >
          <div className="grid grid-cols-5 sm:gap-2 md:gap-2">
            <div className="flex items-center col-span-2">
              {logFileName ? logFileName : "NA"}
            </div>
            <div className="flex justify-center items-center text-center">
              {logFileName ? getLogBoxName (logFileName) : "NA"}
            </div>
            <div className="flex justify-center items-center text-center">
              {logFileName ? getLogFileDate(logFileName) : "NA"}
            </div>
            <div className="flex justify-center items-center text-center">
              <button
                className="bg-green hover:bg-green-dark text-white py-1 px-2 text-black rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
                onClick={() => downloadFile(logFileName)}
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

  function getLogBoxName(fileName: string) {
    return fileName.split("-")[0];
  }

  function getLogFileDate(fileName: string) {
    const fileSplit = fileName.split(".")[0].split("_");
    const date=fileSplit[2]
    
    return date
  }

  async function fetchLogsFileNames(token: string) {
    var myHeaders = new Headers();

    myHeaders.append("Authorization", token);

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `http://194.210.120.104:8080/logs`,  
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
            : setSystemLogs(
                result.map((logFileName: string) => logFileName)
                
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
      fetchLogsFileNames(props.token);
    }
    // eslint-disable-next-line
  }, []);



  function getLogFilesCount(
    result: { BoxName: string; LogFileNames: string[] }[]
  ) {
    let count = 0;
    for (const entry of result) {
      count += entry.LogFileNames.length;
    }
    return count;
  }

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
        setDialogMessage("Failure to download the log file.");
        setOpenDialog(true);
      }
    }

  }

  return (
    <>
      <div className="flex flex-col p-6 w-8/12">
        <h1 className="font-semibold text-lg">System Logs</h1>

        <div className="mt-4 bg-white rounded border border-gray-300 rounded-lg">
          <ul className="divide-y divide-gray-300">
            <div className="px-4 py-2 grid grid-cols-5 sm:gap-2 md:gap-2">
              <div className="font-semibold col-span-2">Log File Name</div>
              <div className="font-semibold flex justify-center items-center text-center">
                Device Name
              </div>
              <div className="font-semibold flex justify-center items-center text-center">
                Date
              </div>
              <div></div>
            </div>
            {isLoading ? (
              <li
                key={""}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <div className="grid grid-cols-6 sm:gap-2 md:gap-4">
                  <div className="col-span-6 flex justify-center items-center text-center">
                    <Loader />
                  </div>
                </div>
              </li>
            ) : errorRetrieving || systemLogs.length === 0 ? (
              <li
                key={""}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <div className="grid grid-cols-5 sm:gap-2 md:gap-2">
                  <div className="col-span-5 flex justify-center items-center text-center">
                    Could not find system logs.
                  </div>
                </div>
              </li>
            ) : (
              displayLogFiles
            )}
          </ul>
        </div>
        {!isLoading &&
          !errorRetrieving &&
          systemLogs.length > itemsPerPage && (
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={Math.ceil(systemLogs.length / itemsPerPage)}
              onPageChange={changePage}
              containerClassName="h-2/3 relative bottom-0 right-0 h-8 list-none flex justify-end items-center ml-4 mt-4"
              previousLinkClassName="bg-green text-white font-semibold p-2 m-3 rounded rounded-lg"
              nextLinkClassName="bg-green text-white font-semibold p-2 ml-3  rounded rounded-lg"
              activeClassName="rounded rounded-lg border border-green p-2 m-3 font-bold m-1"
              pageRangeDisplayed={5}
              marginPagesDisplayed={3}
            />
          )}
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
};

export default LogsPage;
