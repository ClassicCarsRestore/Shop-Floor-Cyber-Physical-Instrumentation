import { useState } from "react";
import Loader from "../Utils/Loader";
import { Link } from "react-router-dom";
import PlugStatus from "./PlugStatus";
import ReactPaginate from "react-paginate";

type Plug = {
  shortID: string;
  isActive: boolean;
  position: number
};

export default function PlugsList(props: {
  plugs: Plug[];
  errorRetrieving: boolean;
  isLoading: boolean;
}) {
  const [pageNumber, setPageNumber] = useState<number>(0);

  const itemsPerPage = 10;
  const itemsVisited = pageNumber * itemsPerPage;

  const displayPlugs = props.plugs
    .slice(itemsVisited, itemsVisited + itemsPerPage)
    .map((plug) => {
      return (
        <li
          key={plug.shortID}
          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
        >
          <Link
            to={{
              pathname: `/plugs/${plug.shortID}`,
              state: { fromPlugsList: true, plugData: plug },
            }}
          >
            <div className="grid grid-cols-6 sm:gap-1 md:gap-2">
              <div className="flex items-center col-span-2">
                {plug.shortID ? plug.shortID : "ND"}
              </div>
              <div className="flex justify-center items-center text-center">
                {plug.position? plug.position: plug.position === 0? "ND":plug.position }
              </div>
              
              <div className="flex justify-center items-center text-center">
                <PlugStatus status={plug.isActive} />{" "}
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
      <h1 className="font-semibold text-lg">System Energy Meters</h1>
      <div className=" mt-4 bg-white rounded border border-gray-300 rounded-lg">
        <ul className="divide-y divide-gray-300">
          <div className="px-4 py-2 grid grid-cols-6 sm:gap-1 md:gap-2">
            <div className="font-semibold col-span-2">Energy Meter Identifier</div>
            <div className="font-semibold flex justify-center items-center text-center">
              Position
            </div>
            <div className="font-semibold flex justify-center items-center text-center">
              Connected
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
          ) : props.errorRetrieving || props.plugs.length === 0 ? (
            <li key={""} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <div className="grid grid-cols-6 sm:gap-2 md:gap-4">
                <div className="col-span-6 flex justify-center items-center text-center">
                  Could not find plugs.
                </div>
              </div>
            </li>
          ) : (
            displayPlugs
          )}
        </ul>
      </div>
      {!props.isLoading &&
        !props.errorRetrieving &&
        props.plugs.length > itemsPerPage && (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(props.plugs.length / itemsPerPage)}
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
