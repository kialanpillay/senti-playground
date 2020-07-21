import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import SentiPlayground from "./pages/SentiPlayground";
import APIPlayground from "./pages/APIPlayground";
import Home from "./pages/Home";

import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);


function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/playground/senti">
            <SentiPlayground />
          </Route>
          <Route exact path="/playground/all">
            <APIPlayground />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
