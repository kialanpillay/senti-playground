import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
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
const api = "https://senti-ment-api.herokuapp.com/";

class APIPlayground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      auth: false,
      text: "",
      response: "",
      score: [],
      req: false,
      api: "",
    };

    this.handleCopy = this.handleCopy.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAnalysis = this.handleAnalysis.bind(this);
  }

  handleComprehension = () => {
    Predictions.interpret({
      text: {
        source: {
          text: this.state.text,
        },
        type: "ALL",
      },
    })
      .then((result) => console.log({ result }))
      .catch((err) => console.log({ err }));
  };

  queryBuilder = (params) => {
    let query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    return query;
  };

  curlBuilder = () => {
    let url = this.requestBuilder();
    return `curl -X GET ${url}`;
  };

  requestBuilder = () => {
    return (
      api + this.state.route + this.queryBuilder({ text: this.state.text })
    );
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

  handleAnalysis = (route) => {
    let params = {
      text: this.state.text,
    };
    this.setState({ route: route, req: false });
    let query = this.queryBuilder(params);

    let url = api + route + query;

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
                A selection of the latest Natural Language Processing APIs.
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
                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title="Analyse"
                  id="input-group-dropdown-2"
                  disabled={this.state.text === ""}
                >
                  <Dropdown.Item onClick={() => this.handleComprehension()}>
                    AWS Comprehend
                  </Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Col>
          </Row>
          <Panel
            route={""}
            req={this.state.req}
            text={this.state.text}
            response={this.state.response}
            api={this.state.api}
            curl={this.state.api === "AWS" ? this.curlBuilder() : ""}
            copyHandler={this.copyHandler}
          />
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(APIPlayground);
