import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";

import rapid from "../assets/rapid.png";
import aws from "../assets/aws.png";
import azure from "../assets/azure.png";
import meaningcloud from "../assets/meaningcloud.png";

import Amplify, { Auth, Hub } from "aws-amplify";
import Predictions, {
  AmazonAIPredictionsProvider,
} from "@aws-amplify/predictions";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../aws-exports";
import paralleldots from "paralleldots";

import Navigation from "../components/Navigation";
import AnalysisCard from "../components/AnalysisCard";
import queryBuilder from "../functions/queryBuilder";

paralleldots.apiKey = "z6AGlBBzF9d8pF3VlsEA2ZSSKvHfwWoL9CvMlybvcOE";

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

const listener = (data) => {
  if (data.payload.event === "signIn") {
    console.log("user signed in");
  } else {
    console.log("user signed out");
  }
};
Hub.listen("auth", listener); //Hub for listening to auth events

class Engine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      auth: false,
      text: "",
      prediction: null, //AWS Response
      response: null, //MeaninCloud Response
      azureResponse: null, //MS Azure Response
    };
    //Handler binding
    this.handleChange = this.handleChange.bind(this);
    this.handleCall = this.handleCall.bind(this);
    this.processResponse = this.processResponse.bind(this);
  }
  //Handles user text input
  handleChange = (event) => {
    this.setState({ text: event.target.value });
  };
  //Handles multiple API calls on user interaction
  handleCall = () => {
    this.AWSAnalysis();
    this.azureAnalysis();
    this.meaningCloudAnalysis();
  };
  //Retrieves sentiment prediction using AWS Comprehend service and AWS Amplify Predictions
  AWSAnalysis = () => {
    Predictions.interpret({
      text: {
        source: {
          text: this.state.text,
        },
        type: "ALL",
      },
    })
      .then((result) => {
        this.setState({
          prediction: result.textInterpretation.sentiment,
        });
      })
      .catch((err) => console.log({ err }));
  };
  //Gets sentiment analysis results from ParallelDots NodeJS API-wrapper module.
  //Note that function is not currently called (See README)
  paralleldotsAnalysis = () => {
    paralleldots
      .sentiment(this.state.text)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Gets sentiment analysis results for a single document from MS Text Analytics API
  //POST Request
  azureAnalysis = () => {
    const payload = {
      documents: [
        {
          id: "1",
          language: "en",
          text: this.state.text,
        },
      ],
    };
    fetch("https://microsoft-text-analytics1.p.rapidapi.com/sentiment", {
      method: "POST",
      headers: {
        "x-rapidapi-host": "microsoft-text-analytics1.p.rapidapi.com",
        "x-rapidapi-key": "646e81359bmsh810817ffde70fc2p16998cjsn345cdec67f45",
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({ azureResponse: result.documents[0] });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //Gets sentiment analysis results from MeaningCloud Sentiment Analysis API
  //GET Request
  meaningCloudAnalysis = () => {
    const params = {
      txt: this.state.text,
      key: "36199e9e0fd774d621355f41f3a1027d",
      lang: "en",
    };
    let url =
      "https://api.meaningcloud.com/sentiment-2.1?" + queryBuilder(params);
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({ response: result });
      });
  };
  //Processes each API response into a uniform format for rendering in other components
  processResponse = (api) => {
    let data;
    if (api === "AWS") {
      data = {
        classification: this.state.prediction.predominant,
        pos: this.state.prediction.positive,
        neg: this.state.prediction.negative,
        neu: this.state.prediction.neutral,
      };
    }
    if (api === "MeaningCloud") {
      if (this.state.response.score_tag.includes("P")) {
        data = {
          classification: "Positive",
          pos: this.state.response.confidence * 0.01,
          neg: 0,
          neu: 0,
        };
      } else if (
        this.state.response.score_tag.includes("NEU") ||
        this.state.response.score_tag.includes("NONE")
      ) {
        data = {
          classification: "Neutral",
          pos: 0,
          neg: 0,
          neu: this.state.response.confidence * 0.01,
        };
      } else {
        data = {
          classification: "Negative",
          pos: 0,
          neg: this.state.response.confidence * 0.01,
          neu: 0,
        };
      }
    }
    if (api === "Azure") {
      data = {
        classification: this.state.azureResponse.sentiment,
        pos: this.state.azureResponse.documentScores.positive,
        neg: this.state.azureResponse.documentScores.negative,
        neu: this.state.azureResponse.documentScores.neutral,
      };
    }
    return data;
  };

  async componentDidMount() {
    let user = await Auth.currentAuthenticatedUser();
    this.setState({ username: user.username, auth: true });
  }

  render() {
    return (
      <div className="App">
        <Navigation username={this.state.username} auth={this.state.auth} />
        <Container style={{ marginTop: "4rem" }}>
          <Row>
            <Col md={10}>
              <h1 className="heading">Sentiment Engine</h1>
            </Col>
          </Row>
          <Row style={{ marginTop: "0rem" }}>
            <Col md="auto">
              <h2 className="text">
                Compare results from different Natural Language Processing APIs.
              </h2>
            </Col>
          </Row>
          <Row style={{ marginTop: "1rem", textAlign: "left" }}>
            <Col md="auto">
              <img src={aws} width={200} alt="Amazon Web Services"></img>
            </Col>
            <Col md="auto">
              <img src={azure} width={300} alt="Microsoft Azure"></img>
            </Col>
            <Col md="auto">
              <img src={rapid} width={100} alt="RapidAPI"></img>
            </Col>
            <Col md="auto">
              <img src={meaningcloud} width={250} alt="MeaningCloud"></img>
            </Col>
          </Row>
          <Row style={{ marginTop: "2rem" }}>
            <Col md={10}>
              <InputGroup className="mb-3" size="lg">
                <FormControl
                  placeholder="Your text here"
                  onChange={this.handleChange}
                />
                <InputGroup.Append>
                  <Button
                    variant="outline-secondary"
                    disabled={this.state.text === ""}
                    onClick={() => this.handleCall()}
                  >
                    Analyse
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Row>
          <Row
            style={{ marginTop: "2rem" }}
            hidden={
              this.state.prediction == null || this.state.response == null
            }
          >
            <Col md={3}>
              {this.state.prediction != null ? (
                <AnalysisCard
                  link={"https://aws.amazon.com/comprehend/"}
                  text={this.state.text}
                  data={this.processResponse("AWS")}
                  org={"Amazon Web Services"}
                  api={"AWS Comprehend"}
                  engine={true}
                />
              ) : null}
            </Col>{" "}
            <Col md={3}>
              {this.state.azureResponse != null ? (
                <AnalysisCard
                  link={
                    "https://rapidapi.com/microsoft-azure-org-microsoft-cognitive-services/api/microsoft-text-analytics1"
                  }
                  text={this.state.text}
                  data={this.processResponse("Azure")}
                  org={"Microsoft Azure"}
                  api={"Microsoft Text Analysis"}
                  engine={true}
                />
              ) : null}
            </Col>
            <Col md={3}>
              {this.state.response != null ? (
                <AnalysisCard
                  link={
                    "https://www.meaningcloud.com/developer/sentiment-analysis/doc/2.1"
                  }
                  text={this.state.text}
                  data={this.processResponse("MeaningCloud")}
                  org={"MeaningCloud"}
                  api={"Sentiment Analysis"}
                  engine={true}
                />
              ) : null}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(Engine);
