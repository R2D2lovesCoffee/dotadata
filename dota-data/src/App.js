import React, { useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './components/views/Home';
import Login from './components/views/Login';
import Protected from './components/Protected';
import Register from './components/views/Register';
import NavigationBar from './components/NavigationBar';
import Profile from './components/views/Profile';
import Contact from './components/views/Contact';
import SoloGame from './components/views/SoloGame';
import RankedGame from './components/views/RankedGame';
import { connect } from './socket';

function App() {
  useEffect(() => {
    connect();
  }, [])
  return (
    <Router>
      <NavigationBar />
      <Switch>
        <Route path="/home">
          <Protected Component={Home} />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route exact path="/">
          <Protected Component={Home} />
        </Route>
        <Route path="/profile">
          <Protected Component={Profile} />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/solo-game">
          <SoloGame />
        </Route>
        <Route path="/ranked-game">
          <RankedGame />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
