import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";

import Amplify, { Auth, Hub } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import awsconfig from "../aws-exports";

import copy from "copy-to-clipboard";
import Speech from "react-speech";

import CopyButton from "../components/CopyButton";
import SentimentScorePieChart from "../components/SentimentScorePieChart";

Amplify.configure(awsconfig);

const listener = (data) => {
  if (data.payload.event === "signIn") {
    console.log("user signed in");
  } else {
    console.log("user signed out");
  }
};
Hub.listen("auth", listener);
const api = "https://senti-ment-api.herokuapp.com/";

class Playground extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      auth: false,
      text: "",
      response: "",
      score: [],
      req: false,
      route: "",
    };

    this.handleCopy = this.handleCopy.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAnalysis = this.handleAnalysis.bind(this);
  }

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
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">
            <h3>Playground</h3>
          </Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/playground">Senti API</Nav.Link>
            <Nav.Link href="/comprehend">AWS Comprehend</Nav.Link>
          </Nav>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <h5 className="username">Signed in as {this.state.username}</h5>
            </Navbar.Text>

            {this.state.auth ? null : null}
          </Navbar.Collapse>
        </Navbar>
        <Container style={{ marginTop: "4rem" }}>
          <Row>
            <Col md={10}>
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
          <Row style={{ marginTop: "2rem" }}>
            <Col md={6}>
              <Card hidden={!this.state.req} style={{ textAlign: "left" }}>
                <Card.Body>
                  <Card.Title>Sentiment Analysis by Senti</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {this.state.route === "bayes/"
                      ? "Naive Bayes Method"
                      : "VADER Method"}{" "}
                    <a href="/" target="_blank" className="link">
                      Learn More
                    </a>
                  </Card.Subtitle>

                  <h5>
                    {this.state.req ? this.state.response.classification : null}
                  </h5>
                  <Speech
                    textAsButton={true}
                    displayText="Listen"
                    text={`The sentence, ${this.state.text}, is ${this.state.response.classification}.`}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col>
              {this.state.req ? (
                <SentimentScorePieChart
                  data={this.state.response}
                  route={this.state.route}
                />
              ) : null}
            </Col>
          </Row>
          <Row style={{ marginTop: "0rem" }}>
            <Col md={6}>
              <Table hidden={!this.state.req} style={{ textAlign: "left" }}>
                <thead >
                  <tr>
                    <th style={{ borderTop: "0px", borderBottom: "2px" }}>
                      <CopyButton handler={this.handleCopy} /> cURL Command
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="code">{this.curlBuilder()}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(Playground);
