import PlugsMapTab from "./ActivitiesMapTab";
import React from "react";

const PlugsPage = (props: { token:any}) => {
  const [openTab, setOpenTab] = React.useState(1);

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
                Live Activity Map
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                  <PlugsMapTab token={props.token} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlugsPage;
