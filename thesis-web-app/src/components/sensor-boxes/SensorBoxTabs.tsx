import React from "react";
import SensorBoxAlarmsTab from "./SensorBoxAlarmsTab";
import SensorBoxDetailsTab from "./SensorBoxDetailsTab";
import SensorBoxOnOffControl from "./SensorBoxOnOffControl";
import SensorBoxInferencesTab from "./SensorBoxInferencesTab";
import SensorBoxConfigurationTab from "./SensorBoxConfigurationTab";

const SensorBoxTabs = (props: { boxData: any , token:any}) => {
  
  const [openTab, setOpenTab] = React.useState(1);

  return (
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
              Details
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
              Configuration
            </a>
          </li>
          {/* <li className="-mb-px mr-2 last:mr-0 flex justify-center items-center text-center">
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
              Inferences
            </a>
          </li> */}
          <li className="-mb-px mr-2 last:mr-0 flex justify-center items-center text-center">
            <a
              className={
                "font-semibold px-5 py-3 shadow-lg rounded block leading-normal" +
                (openTab === 4 ? "text-white bg-red-light" : "bg-white")
              }
              onClick={(e) => {
                e.preventDefault();
                setOpenTab(4);
              }}
              data-toggle="tab"
              href="#link4"
              role="tablist"
            >
              Alarms
            </a>
          </li>
          <li className="-mb-px mr-2 last:mr-0 flex justify-center items-center text-center">
            <SensorBoxOnOffControl boxData={props.boxData} token={props.token}/>
          </li>
        </ul>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
          <div className="px-4 py-5 flex-auto">
            <div className="tab-content tab-space">
              <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                <SensorBoxDetailsTab boxData={props.boxData} token={props.token} />
              </div>
              <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                <SensorBoxConfigurationTab boxData={props.boxData} token={props.token}/>
              </div>
              <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                <SensorBoxInferencesTab boxId={props.boxData.thingName} token={props.token} />
              </div>
              <div className={openTab === 4 ? "block" : "hidden"} id="link4">
                <SensorBoxAlarmsTab thingName={props.boxData.thingName} token={props.token}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorBoxTabs;
