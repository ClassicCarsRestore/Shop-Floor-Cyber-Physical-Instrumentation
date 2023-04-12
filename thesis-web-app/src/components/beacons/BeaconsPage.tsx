import BeaconsMapTab from "./BeaconsMapTab";
import { BeaconDTO } from "../../interfaces";
import { useHistory } from "react-router-dom";
import BeaconsList from "./BeaconsListMainTab";
import React, { useContext, useEffect, useState } from "react";
import BeaconsConfiguration from "./BeaconsConfigurationMainTab";

const BeaconsPage = (props: { token:any}) => {

  const history = useHistory();
  const [openTab, setOpenTab] = React.useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [beacons, setBeacons] = useState<BeaconDTO[]>([]);
  const [errorRetrieving, setErrorRetrieving] = useState<boolean>(false);

  async function fetchBeacons(token: string) {
    var myHeaders = new Headers();

    myHeaders.append("Authorization",  token);

    var requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    await fetch(
      `http://194.210.120.104:8080/beacons`,
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
            : setBeacons(result.map((beacon: BeaconDTO) => beacon));
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
      fetchBeacons(props.token);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col p-6 w-8/12">
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
            role="tablist"
          >
            <li className="-mb-px mr-2 last:mr-0 flex justify-center items-center text-center">
              <a
                className={
                  "font-semibold px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 1 ? "bg-red-light" : "bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                Beacons
              </a>
            </li>
            {/* <li className="-mb-px mr-2 last:mr-0 flex justify-center items-center text-center">
              <a
                className={
                  "font-semibold px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 2 ? "bg-red-light" : "bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                Configuration
              </a>
            </li> */}
            <li className="-mb-px mr-2 last:mr-0 flex justify-center items-center text-center">
              <a
                className={
                  "font-semibold px-5 py-3 shadow-lg rounded block leading-normal " +
                  (openTab === 3 ? "bg-red-light" : "bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                Map
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                  <BeaconsList
                    beacons={beacons}
                    errorRetrieving={errorRetrieving}
                    isLoading={isLoading}
                  />
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  <BeaconsConfiguration token={props.token} />
                </div>
                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  <BeaconsMapTab beacons={beacons} token={props.token}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeaconsPage;
