import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Playground from "./pages/Playground";
import Engine from "./pages/Engine";
import Home from "./pages/Home";
import Corpus from "./pages/Corpus";
import Newsreel from "./pages/Newsreel";

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
          <Route exact path="/engine">
            <Engine />
          </Route>
          <Route exact path="/corpus">
            <Corpus />
          </Route>
          <Route exact path="/newsreel">
            <Newsreel />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;