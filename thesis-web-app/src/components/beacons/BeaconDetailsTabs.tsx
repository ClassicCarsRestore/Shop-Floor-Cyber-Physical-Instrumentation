import React from "react";
import BeaconAlarmsTab from "./BeaconAlarmsTab";
import BeaconReplacementTab from "./BeaconReplacementTab";

const BeaconDetailsTabs = (props: { beaconData: any, token:any  }) => {
  
  const [openTab, setOpenTab] = React.useState(1);

  return (
    <div className="flex flex-wrap">
        <ul
          className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
          role="tablist"
        >
          <li className="-mb-px mr-2 last:mr-0 flex justify-center items-center text-center">
            <a
              className={
                "font-semibold px-5 py-3 shadow-lg rounded block leading-normal " +
                (openTab === 1
                  ? "bg-red-light" //text-white
                  : "bg-white")
              }
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(1);
              }}
              data-toggle="tab"
              href="#link1"
              role="tablist"
            >
              Replace Beacon
            </a>
          </li>
          <li className="-mb-px mr-2 last:mr-0 flex justify-center items-center text-center">
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
              Alarms
            </a>
          </li>
        </ul>
        <div className="relative flex flex-col break-words bg-white w-full mb-6 shadow-lg rounded">
          <div className="px-4 py-5 flex-auto">
            <div className="tab-content tab-space">
              <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                <BeaconReplacementTab beaconData={props.beaconData} token={props.token} />
              </div>
              <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                <BeaconAlarmsTab beaconId={props.beaconData.shortID} token={props.token} />
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default BeaconDetailsTabs;
