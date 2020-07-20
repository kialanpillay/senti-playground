import React from "react";
import "./App.css";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";

import Amplify from 'aws-amplify';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.awsPrediction = this.awsPrediction.bind(this);
  }

  awsPrediction = () => {
    Predictions.interpret({
      text: {
        source: {
          text: "Hello this is a test.",
        },
        type: "ALL"
      }
    })
    .then(result => console.log({ result }))
    .catch(err => console.log({ err }))
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1 className="title">SENTI</h1>
          <h3 className="tag">sentiment analysis playground</h3>
        </header>
        <Container></Container>
      </div>
    );
  }
}
