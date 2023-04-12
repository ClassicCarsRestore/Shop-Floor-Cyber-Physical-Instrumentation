import Loader from "../Utils/Loader";
import { useHistory } from "react-router";
import { AlarmDTO, PlugDTO } from "../../interfaces";
import { useContext, useEffect, useState } from "react";

export default function PlugAlarmsTab(props: { plugId: string, token:any  }) {

  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorRetrieving, setErrorRetrieving] = useState<boolean>(false);
  const [plugAlarms, setPlugAlarms] = useState<AlarmDTO[]>([]);

  async function fetchPlugAlarms(token: string) {
    var myHeaders = new Headers();

    myHeaders.append("Authorization", token);

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    await fetch(
      // `https://o3tbzwf5ek.execute-api.eu-central-1.amazonaws.com/prod/beacon/${props.beaconId}/alarms`
      `http://194.210.120.104:8080/alarms/device?deviceId=${props.plugId}`,
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
            : setPlugAlarms(result.map((plug: PlugDTO) => plug));
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
      fetchPlugAlarms(props.token);
    }
      
    
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <h1 className="font-semibold text-lg">Energy Meter {props.plugId} Alarms</h1>

      <div className="mt-4 bg-white rounded border border-gray-300 rounded-lg max-w-7xl">
        <ul className="divide-y divide-gray-300">
          <div className="px-4 py-2 grid grid-cols-6  sm:gap-2 md:gap-4">
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
                  Alarms not found for this plug.
                </div>
              </div>
            </li>
          ) : (
            plugAlarms.map((alarm) => (
              <li
                key={alarm.Date + alarm.Time}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <div className="grid grid-cols-6 sm:gap-2 md:gap-4">
                  <div className={"col-span-3"}>
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
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}
