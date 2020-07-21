import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Playground from "./pages/Playground";
import Engine from "./pages/Engine";
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
          <Route exact path="/senti">
            <Playground />
          </Route>
          <Route exact path="/all">
            <Engine />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
