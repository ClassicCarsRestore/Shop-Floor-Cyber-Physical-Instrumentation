import './App.css';
import {useState} from 'react';
import NavBar from './components/Utils/NavBar';
import UserPage from './components/user/UserPage';

import LogsPage from './components/system-logs/LogsPage';
import InferencesPage from './components/system-inferences/InferencesPage';
import BeaconsPage from './components/beacons/BeaconsPage';
import AlarmsPage from './components/system-alarms/AlarmsPage';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import SensorBoxesPage from './components/sensor-boxes/SensorBoxesPage';
import PlugsPage from './components/system-plugs/PlugsPage';
import ActivitiesPage from './components/system-Activities/ActivitiesPage';
import PlugsDetailsPage from './components/system-plugs/PlugsDetailsPage';
import BeaconsDetailsPage from './components/beacons/BeaconsDetailsPage';
import SensorBoxesDetailsPage from './components/sensor-boxes/SensorBoxDetailsPage';

import LogInForm from './components/log-in/LogInForm';
import ForgotPasswordForm from './components/log-in/ForgotPasswordForm';

import useToken from "./components/log-in/usetoken";




function App() {
  const { token, setToken } = useToken();

  console.log("App token",token)
  
  return (
    <Router>
        <div className="app flex flex-row">
        <NavBar token={token} setToken={setToken}/>
          <Switch>              
              <Route path="/" exact component={() =><LogInForm token={token} setToken={setToken}/>}/>
              <Route path="/forgot" exact component={() => <ForgotPasswordForm />}/>
              <Route path="/sensorboxes" exact component={() => <SensorBoxesPage token={token} setToken={setToken} />}/>
              <Route path="/sensorboxes/:id" exact component={() => <SensorBoxesDetailsPage token={token} />}/>
              <Route path="/beacons" exact component={() => <BeaconsPage token={token} />}/>
              <Route path="/beacons/:id" exact component={() => <BeaconsDetailsPage token={token}/>}/>
              <Route path="/plugs" exact component={() => <PlugsPage token={token}/>}/>
              <Route path="/plugs/:id" exact component={() => <PlugsDetailsPage token={token}/>}/>
              <Route path="/activities" exact component={() => <ActivitiesPage token={token}/>}/>
              <Route path="/alarms" exact component={() => <AlarmsPage token={token}/>}/>
              <Route path="/logs" exact component={() => <LogsPage token={token}/>}/>
              <Route path="/inferences" exact component={() => <InferencesPage token={token}/>}/>
              <Route path="/user" exact component={() => <UserPage token={token} />}/>
          </Switch>
            
        </div>
    </Router>
  );
}

export default App;
