import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";

import Amplify, { Auth } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../aws-exports";

import copy from "copy-to-clipboard";

import Navigation from "../components/Navigation";
import Panel from "../components/Panel";
import queryBuilder from "../functions/queryBuilder";

Amplify.configure(awsconfig);

const api = "https://senti-ment-api.herokuapp.com/";

class Playground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      auth: false,
      text: "",
      response: "",
      req: false,
      route: "",
      api: "Senti",
    };

    this.handleCopy = this.handleCopy.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAnalysis = this.handleAnalysis.bind(this);
  }
  //Returns a cURL command
  curlBuilder = (route) => {
    let url = this.requestBuilder(route);
    return `curl -X GET ${url}`;
  };

  //Returns a request URL for a particular API, route, and parameters
  requestBuilder = (route) => {
    return api + route + queryBuilder({ text: this.state.text });
  };

  //Handles copying cURL to clipboard
  handleCopy = () => {
    let content = this.curlBuilder(this.state.route);
    try {
      copy(content);
    } catch {
      console.log("Error");
    }
    console.log(content);
  };
  //Handles user text input
  handleChange = (event) => {
    this.setState({ text: event.target.value, req: false });
  };
  //Gets sentiment analysis results from Senti API using the user-defined routes/method
  //GET Request
  handleAnalysis = (route) => {
    this.setState({ route: route, req: false });
    let url = this.requestBuilder(route);
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
            <Col md={12}>
              <h1 className="heading">Introducing Senti API</h1>
            </Col>
          </Row>
          <Row style={{ marginTop: "0rem" }}>
            <Col md="auto">
              <h2 className="text">
                A Python{" "}
                <a
                  className="link"
                  href="https://senti-ment-api.herokuapp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API
                </a>{" "}
                for Sentiment Analysis using NLTK. Try it out.
              </h2>
            </Col>
          </Row>
          <Row style={{ marginTop: "3rem" }}>
            <Col md={10}>
              <InputGroup className="mb-3" size="lg">
                <FormControl
                  placeholder="Your text here"
                  onChange={this.handleChange}
                />
                <DropdownButton
                  as={InputGroup.Append}
                  variant="outline-secondary"
                  title="Analyse"
                  id="input-group-dropdown-2"
                  disabled={this.state.text === ""}
                >
                  <Dropdown.Item onClick={() => this.handleAnalysis("bayes/")}>
                    Senti Naive Bayes
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.handleAnalysis("vader/")}>
                    Senti VADER
                  </Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Col>
          </Row>
          {/*Renders sentiment analysis data panel*/}
          <Panel
            route={this.state.route}
            req={this.state.req}
            text={this.state.text}
            response={this.state.response}
            api={this.state.api}
            curl={this.curlBuilder(this.state.route)}
            copyHandler={this.handleCopy}
          />
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(Playground);
