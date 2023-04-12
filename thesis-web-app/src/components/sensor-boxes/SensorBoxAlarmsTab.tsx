import Loader from "../Utils/Loader";
import { useHistory } from "react-router";
import ModalDialog from "../Utils/Dialog";
import ReactPaginate from "react-paginate";
import { AlarmDTO } from "../../interfaces";
import { useContext, useEffect, useState } from "react";

export default function AlarmsTab(props: { thingName: string , token:any  }) {

  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [boxAlarms, setBoxAlarms] = useState<AlarmDTO[]>([]);
  const [errorRetrieving, setErrorRetrieving] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const itemsPerPage = 7;
  const itemsVisited = pageNumber * itemsPerPage;

  const displayBoxAlarms = boxAlarms
    .slice(itemsVisited, itemsVisited + itemsPerPage)
    .map((alarm) => {
      return (
        <li
          key={alarm.Date + alarm.Time}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
        >
          <div className="grid grid-cols-6 sm:gap-2 md:gap-4">
            <div className="col-span-3">
              {alarm.Message ? alarm.Message : "NA"}
            </div>
            <div className="flex justify-center items-center text-center">
              {alarm.Date ? alarm.Date : "NA"}
            </div>
            <div className="flex justify-center items-center text-center">
              
              {alarm.Time ? alarm.Time : "NA"}
            </div>
            <div className="flex justify-center items-center text-center">
              
              {alarm.FixTip ? alarm.FixTip : "NA"}
            </div>
            {/* <div className="flex justify-center items-center text-center">
              
              <ModalDialog message={alarm.FixTip} apiFeedback={false} /> 
            </div> */}
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

  async function fetchSensorBoxAlarms(token: string) {
    var myHeaders = new Headers();

    myHeaders.append("Authorization", token);

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      // `https://o3tbzwf5ek.execute-api.eu-central-1.amazonaws.com/prod/sensorbox/${props.thingName}/alarms`,
      `http://194.210.120.104:8080/alarms/device?deviceId=${props.thingName}`,
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
            : setBoxAlarms(result.map((alarm: AlarmDTO) => alarm));
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
      fetchSensorBoxAlarms(props.token);
    }
    
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <h1 className="font-semibold text-lg">Sensor Box Alarms</h1>

      <div className=" mt-4 bg-white rounded border border-gray-300 rounded-lg max-w-7xl">
        <ul className="divide-y divide-gray-300">
          <div className="px-4 py-2 grid grid-cols-6 sm:gap-2 md:gap-4">
          <div className="font-semibold col-span-3">Alarm Description</div>
            <div className="font-semibold flex justify-center items-center text-center">
              Date
            </div>
            <div className="font-semibold flex justify-center items-center text-center">
              Time
            </div>
            <div className="font-semibold flex justify-center items-center text-center">
              FixTip
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
                  Could not find alarms from this sensor box.
                </div>
              </div>
            </li>
          ) : (
            displayBoxAlarms
          )}
        </ul>
      </div>
      {!isLoading && !errorRetrieving && boxAlarms.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(boxAlarms.length / itemsPerPage)}
          onPageChange={changePage}
          containerClassName="w-full relative bottom-0 right-0 h-8 list-none flex justify-end items-center ml-4  mt-4"
          previousLinkClassName="bg-green text-white font-semibold p-2 m-3 rounded rounded-lg"
          nextLinkClassName="bg-green text-white font-semibold p-2 m-3 rounded rounded-lg"
          activeClassName="rounded rounded-lg border border-green p-2 m-3 font-bold m-1"
          pageRangeDisplayed={5}
          marginPagesDisplayed={3}
        />
      )}
    </>
  );
}
