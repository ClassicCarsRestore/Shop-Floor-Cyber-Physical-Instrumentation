import Loader from "../Utils/Loader";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {AlarmDTO } from "../../interfaces";

const AlarmsPage = (props: { token:any}) => {


  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorRetrieving, setErrorRetrieving] = useState<boolean>(false);
  const [systemAlarms, setSystemAlarms] = useState([] as (AlarmDTO)[]);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const itemsPerPage = 7;
  const itemsVisited = pageNumber * itemsPerPage;

  const displayAlarms = systemAlarms
    .slice(itemsVisited, itemsVisited + itemsPerPage)
    .map((alarm) => {
      return (
        <li
          key={alarm.Date + alarm.Time + alarm.DeviceId}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
        >
          <div className="grid grid-cols-7 sm:gap-2 md:gap-2">
            <div className="col-span-2 flex justify-center items-center text-center">
              {alarm.Message ? alarm.Message : "NA"}
            </div>
            <div className="flex justify-center items-center text-center">
              {alarm.DeviceId ? alarm.DeviceId : "NA"}
            </div>
            <div className="flex justify-center items-center text-center">
              {alarm.DeviceType ? alarm.DeviceType : "NA"}
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

  async function fetchSystemAlarms(token: string) {
    var myHeaders = new Headers();

    myHeaders.append("Authorization",  token);

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      "http://194.210.120.104:8080/alarms",
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
            : setSystemAlarms(
                result.map(
                  (systemAlarm: AlarmDTO) =>
                    systemAlarm
                )
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
      fetchSystemAlarms(props.token);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col p-6 w-8/12">
      <h1 className="font-semibold text-lg">System Alarms</h1>
      <div className="">
        <div className="mt-4 bg-white rounded border border-gray-300 rounded-lg">
          <ul className="divide-y divide-gray-300">
            <div className="px-4 py-2 grid grid-cols-7 sm:gap-1 md:gap-2">
              <div className="font-semibold flex items-center col-span-2">
                Alarm Description
              </div>
              <div className="font-semibold flex justify-center items-center text-center">
                Device Id
              </div>
              <div className="font-semibold flex justify-center items-center text-center">
                Device Type
              </div>
              <div className="font-semibold flex justify-center items-center text-center">
                Date
              </div>
              <div className="font-semibold flex justify-center items-center text-center">
                Time
              </div>
              <div className="font-semibold flex justify-center items-center text-center">
                Fix Tip
              </div>
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
            ) : errorRetrieving || systemAlarms.length === 0 ? (
              <li
                key={""}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <div className="grid grid-cols-6 sm:gap-2 md:gap-4">
                  <div className="col-span-6 flex justify-center items-center text-center">
                    Could not find system alarms.
                  </div>
                </div>
              </li>
            ) : (
              displayAlarms
            )}
          </ul>
        </div>
        {!isLoading &&
          !errorRetrieving &&
          systemAlarms.length > itemsPerPage && (
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={Math.ceil(systemAlarms.length / itemsPerPage)}
              onPageChange={changePage}
              containerClassName="relative bottom-0 right-0 h-8 list-none flex justify-end items-center ml-4 mt-4"
              previousLinkClassName="bg-green text-white font-semibold p-2 m-3 rounded rounded-lg"
              nextLinkClassName="bg-green text-white font-semibold p-2 ml-3 rounded rounded-lg"
              activeClassName="rounded rounded-lg border border-green p-2 m-3 font-bold m-1"
              pageRangeDisplayed={5}
              marginPagesDisplayed={3}
            />
          )}
      </div>
    </div>
  );
};

export default AlarmsPage;
