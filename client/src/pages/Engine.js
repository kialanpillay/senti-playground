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
import pd from "../assets/pd.png";

import Amplify, { Auth, Hub } from "aws-amplify";
import Predictions, {
  AmazonAIPredictionsProvider,
} from "@aws-amplify/predictions";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../aws-exports";
import paralleldots from "paralleldots";

import Navigation from "../components/Navigation";
import AnalysisCard from "../components/AnalysisCard";

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
Hub.listen("auth", listener);

class Engine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      auth: false,
      text: "",
      prediction: null,
      response: null,
      req: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCall = this.handleCall.bind(this);
    this.handleAnalysis = this.handleAnalysis.bind(this);
    this.handleAWSAnalysis = this.handleAWSAnalysis.bind(this);
    this.processResponse = this.processResponse.bind(this);
  }

  processResponse = (api) => {
    let data;
    console.log(this.state.response);
    if (api === "AWS") {
      data = {
        classification: this.state.prediction.predominant,
        pos: this.state.prediction.positive,
        neg: this.state.prediction.negative,
        neu: this.state.prediction.neutral,
      };
    }
    if (api === "PD") {
      const values = [
        this.state.response.sentiment.positive,
        this.state.response.sentiment.negative,
        this.state.response.sentiment.neutral,
      ];
      const index = values.indexOf(Math.max(...values));
      let classification;
      if(index === 0){
        classification = "Positive"
      }
      else if (index === 1){
        classification = "Negative"
      }
      else {
        classification = "Neutral"
      }
      data = {
        classification: classification,
        pos: this.state.response.sentiment.positive,
        neg: this.state.response.sentiment.negative,
        neu: this.state.response.sentiment.neutral,
      };
    }
    return data;
  };

  handleAWSAnalysis = () => {
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

  handleChange = (event) => {
    this.setState({ text: event.target.value });
  };

  handleCall = () => {
    this.handleAWSAnalysis();
    this.handleAnalysis();
  };

  handleAnalysis = () => {
    paralleldots
      .sentiment(this.state.text)
      .then((response) => {
        this.setState({
          response: JSON.parse(response),
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
              <img src={pd} width={400} alt="Microsoft Azure"></img>
            </Col>
            <Col md="auto">
              <img src={rapid} width={100} alt="RapidAPI"></img>
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
            <Col md={4}>
              {this.state.prediction != null ? (
                <AnalysisCard
                  link={"https://aws.amazon.com/comprehend/"}
                  req={true}
                  text={this.state.text}
                  data={this.processResponse("AWS")}
                  api={"Amazon Web Services"}
                  method={"AWS Comprehend"}
                />
              ) : null}
            </Col>{" "}
            <Col md={4}>
              {this.state.response != null ? (
                <AnalysisCard
                  link={"https://www.paralleldots.com/text-analysis-apis"}
                  req={true}
                  text={this.state.text}
                  data={this.processResponse("PD")}
                  api={"ParallelDots"}
                  method={"Sentiment"}
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
