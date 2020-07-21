import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Playground from "./pages/Playground";
import Home from "./pages/Home";

import Amplify from "aws-amplify";
import Predictions, {
  AmazonAIPredictionsProvider,
} from "@aws-amplify/predictions";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

const comprehend = () => {
  Predictions.interpret({
    text: {
      source: {
        text: "Hello this is a test.",
      },
      type: "ALL",
    },
  })
    .then((result) => console.log({ result }))
    .catch((err) => console.log({ err }));
};

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/playground">
            <Playground />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
