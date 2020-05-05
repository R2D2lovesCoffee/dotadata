import React from 'react';
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
import socket from './socket';
function App() {
  return (
    <Router>
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
        <Route path="/">
          <Protected Component={Home} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
