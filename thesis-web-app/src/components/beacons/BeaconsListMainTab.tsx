import { useState } from "react";
import Loader from "../Utils/Loader";
import { Link } from "react-router-dom";
import BeaconStatus from "./BeaconStatus";
import ReactPaginate from "react-paginate";

type Beacon = {
  isActive: boolean;
  shortID: string;
  zone: number;
  batteryLevel: number;
};

export default function BeaconsList(props: {
  beacons: Beacon[];
  errorRetrieving: boolean;
  isLoading: boolean;
}) {
  const [pageNumber, setPageNumber] = useState<number>(0);

  const itemsPerPage = 10;
  const itemsVisited = pageNumber * itemsPerPage;

  const displayBeacons = props.beacons
    .slice(itemsVisited, itemsVisited + itemsPerPage)
    .map((beacon) => {
      return (
        <li
          key={beacon.shortID}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
        >
          <Link
            to={{
              pathname: `/beacons/${beacon.shortID}`,
              state: { fromBeaconsList: true, beaconData: beacon },
            }}
          >
            <div className="grid grid-cols-6 sm:gap-1 md:gap-2">
              <div className="flex items-center col-span-2">
                {beacon.shortID ? beacon.shortID : "NA"}
              </div>
              <div className="flex justify-center items-center text-center">
                {beacon.zone ? beacon.zone: beacon.zone === 0? "ND":beacon.zone}
              </div>
              <div className="flex justify-center items-center text-center">
                {beacon.batteryLevel ? beacon.batteryLevel : "NA"}
              </div>
              <div className="flex justify-center items-center text-center">
                <BeaconStatus status={beacon.isActive} />{" "}
              </div>
              <div className="flex justify-center items-center text-center">
                <button
                  className={
                    "bg-green hover:bg-green-dark text-white py-1 px-2 text-black rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
                  }
                >
                  See Details
                </button>
              </div>
            </div>
          </Link>
        </li>
      );
    });

  interface PageProps {
    selected: number;
  }
  const changePage = ({ selected }: PageProps) => {
    setPageNumber(selected);
  };

  return (
    <>
      <h1 className="font-semibold text-lg">System Beacons</h1>
      <div className=" mt-4 bg-white rounded border border-gray-300 rounded-lg">
        <ul className="divide-y divide-gray-300">
          <div className="px-4 py-2 grid grid-cols-6 sm:gap-1 md:gap-2">
            <div className="font-semibold col-span-2">Beacon Identifier</div>
            <div className="font-semibold flex justify-center items-center text-center">
              Position
            </div>
            <div className="font-semibold flex justify-center items-center text-center text-center">
              Battery Level (%)
            </div>
            <div className="font-semibold flex justify-center items-center text-center">
              Coupled
            </div>
            <div></div>
          </div>
          {props.isLoading ? (
            <li key={""} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <div className="grid grid-cols-6 sm:gap-2 md:gap-4">
                <div className="col-span-6 flex justify-center items-center text-center">
                  <Loader />
                </div>
              </div>
            </li>
          ) : props.errorRetrieving || props.beacons.length === 0 ? (
            <li key={""} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <div className="grid grid-cols-6 sm:gap-2 md:gap-4">
                <div className="col-span-6 flex justify-center items-center text-center">
                  Could not find beacons.
                </div>
              </div>
            </li>
          ) : (
            displayBeacons
          )}
        </ul>
      </div>
      {!props.isLoading &&
        !props.errorRetrieving &&
        props.beacons.length > itemsPerPage && (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(props.beacons.length / itemsPerPage)}
            onPageChange={changePage}
            containerClassName="w-full relative bottom-0 right-0 h-8 list-none flex justify-end items-center ml-4 mt-4"
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
