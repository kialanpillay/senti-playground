import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";

import Amplify, { Auth, Hub } from "aws-amplify";
import Predictions, {
  AmazonAIPredictionsProvider,
} from "@aws-amplify/predictions";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../aws-exports";

import copy from "copy-to-clipboard";

import Navigation from "../components/Navigation";
import Panel from "../components/Panel";

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

class APIPlayground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      auth: false,
      text: "",
      response: "",
      req: false,
    };

    this.handleCopy = this.handleCopy.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAPICall = this.handleAPICall.bind(this);
    this.handleAWSComprehension = this.handleAWSComprehension.bind(this);
  }

  handleAWSComprehension = () => {
    this.setState({ req: false, api: "AWS" });
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
          response: result.textInterpretation.sentiment,
          req: true,
        });
      })
      .catch((err) => console.log({ err }));
  };

  queryBuilder = (params) => {
    let query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    return query;
  };

  requestBuilder = (api) => {
    return api + this.queryBuilder({ text: this.state.text });
  };

  handleCopy = () => {
    let content = this.curlBuilder();
    try {
      copy(content);
    } catch {
      console.log("Error");
    }
  };

  handleChange = (event) => {
    this.setState({ text: event.target.value, req: false });
  };

  handleAPICall = (api) => {
    this.setState({ req: false });
    let url = this.requestBuilder(api);

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          response: result.classification,
          req: true,
        });
      })
      .catch(function (error) {
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
              <h1 className="heading">API Playground</h1>
            </Col>
          </Row>
          <Row style={{ marginTop: "0rem" }}>
            <Col md="auto">
              <h2 className="text">
                Compare results from different Natural Language Processing APIs.
              </h2>
            </Col>
          </Row>
          <Row style={{ marginTop: "3rem" }}>
            <Col md={10}>
              <InputGroup className="mb-3" size="lg">
                <FormControl
                  placeholder="Text to classify"
                  onChange={this.handleChange}
                />
                <InputGroup.Append>
                  <Button
                    variant="outline-secondary"
                    disabled={this.state.text === ""}
                    onClick={() => this.handleAWSComprehension()}
                  >
                    Analyse
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Row>
          {this.state.req ? (
            <Panel
              link={""}
              req={this.state.req}
              text={this.state.text}
              response={this.state.response}
              api={"AWS"}
              method={"AWS Comprehend"}
              copyHandler={this.copyHandler}
            />
          ) : null}
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(APIPlayground);
