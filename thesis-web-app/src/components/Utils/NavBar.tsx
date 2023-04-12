import "../../css/NavBar.css";
import { Link } from "react-router-dom";
import logoRaimundo from "../../Logo RB Texto.jpeg";
import plugIcon from '../../electric-plug-icon Navbar.svg'
import { useHistory } from "react-router";
import liveDataIcon from '../../real-time-data-analysis.svg'

const NavBar = (props: { token: any, setToken:any}) => {
  const history = useHistory();

  const handleLogOut = async (e: any) => {
    e.preventDefault();
    props.setToken(undefined)
    history.push("/");
      
  };
  
  if (props.token){

    return (
      <div className="w-60">
        <div className="flex flex-col">
          <div className="flex flex-shrink-0 justify-center">
            <img
              className="h-15 w-45"
              src={logoRaimundo}
              alt="Raimundo Branco Logo"
            />
          </div>
          <div className="flex w-60 max-w-xs p-4 bg-white">
            <ul className="flex flex-col w-60">
              <li className="my-px">
                <span className="flex font-medium text-sm text-gray-400 px-4 my-4 uppercase">
                  System Management
                </span>
              </li>
              <li className="my-px">
                <Link
                  to="/sensorboxes"
                  className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center text-lg text-gray-400">
                    <svg
                      fill="none"
                      className="w-6 h-6"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      ></path>
                    </svg>
                  </span>
                  <span className="ml-3">Sensor Boxes</span>
                </Link>
              </li>
              <li className="my-px">
                <Link
                  to="/beacons"
                  className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center text-lg text-gray-400">
                    <svg
                      fill="none"
                      className="w-6 h-6"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
                      ></path>
                    </svg>
                  </span>
                  <span className="ml-3">Bluetooth Beacons</span>
                </Link>
              </li>
              {/* <li className="my-px">
                <Link
                  to="/tools"
                  className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center text-lg text-gray-400">
                    <svg
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </span>
                  <span className="ml-3">Shop Tools</span>
                </Link>
              </li> */}
              <li className="my-px">
                <Link
                  to="/plugs"
                  className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center text-lg text-gray-400">
                    <img
                      style={{height:"22px"}}
                      src={plugIcon}
                      alt="Raimundo Branco Logo"
                    />
                  </span>
                  <span className="ml-3">Energy Meters</span>
                </Link>
              </li>
              <li className="my-px">
                <Link
                  to="/activities"
                  className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center text-lg text-gray-400">
                    <img
                      style={{height:"22px"}}
                      src={liveDataIcon}
                      alt="Live Data"
                    />
                  </span>
                  <span className="ml-3">Live Activity</span>
                </Link>
              </li>
              <li className="my-px">
                <Link
                  to="/alarms"
                  className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center text-lg text-gray-400">
                    <svg
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                  </span>
                  <span className="ml-3">Alarms</span>
                </Link>
              </li>
              <li className="my-px">
                <Link
                  to="/inferences"
                  className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center text-lg text-gray-400">
                    <svg
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                  </span>
                  <span className="ml-3">Inferences Files</span>
                </Link>
              </li>
              <li className="my-px">
                <Link
                  to="/logs"
                  className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center text-lg text-gray-400">
                    <svg
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                  </span>
                  <span className="ml-3">Sensor Boxes Logs</span>
                </Link>
              </li>
              <li className="my-px">
                <span className="flex font-medium text-sm text-gray-400 px-4 my-4 uppercase">
                  Account
                </span>
              </li>
              <li className="my-px">
                <Link
                  to="/user"
                  className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center text-lg text-gray-400">
                    <svg
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </span>
                  <span className="ml-3">Profile</span>
                </Link>
              </li>
              <li className="my-px">
                <Link
                  to=""
                  onClick={handleLogOut}
                  className="flex flex-row items-center h-12 px-4 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  <span className="flex items-center justify-center text-lg text-red-400">
                    <svg
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
                    </svg>
                  </span>
                  <span className="ml-3">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
   }else return <Link to="/"></Link>;
};

export default NavBar;
