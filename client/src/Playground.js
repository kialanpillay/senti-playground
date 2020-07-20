import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";

import Amplify, { Auth, Hub } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const listener = (data) => {
  if (data.payload.event === "signIn") {
    console.log("user signed in");
  } else {
    console.log("user signed out");
  }
};
Hub.listen("auth", listener);

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
      reqType: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAnalysis = this.handleAnalysis.bind(this);
  }

  handleChange = (event) => {
    this.setState({ text: event.target.value });
  };

  handleAnalysis = (type) => {
    let params = {
      text: this.state.text,
    };
    console.log(type);
    this.setState({ reqType: type });
    let query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
    let url = "https://senti-ment-api.herokuapp.com/";
    if (type === "bayes") {
      url = url + "bayes/" + query;
    } else {
      url = url + "vader/" + query;
    }

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
        <Container style={{ marginTop: "6rem" }}>
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
          <Row style={{ marginTop: "4rem" }}>
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
                >
                  <Dropdown.Item onClick={() => this.handleAnalysis("bayes")}>
                    Naive Bayes
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.handleAnalysis("vader")}>
                    VADER
                  </Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Col>
          </Row>
          <Row style={{ marginTop: "2rem" }}>
            <Col md={10}>
              <h4 className="text" hidden={!this.state.req}>
                {this.state.reqType === "bayes"
                  ? "Naive Bayes indicates that your text is " +
                    this.state.response.toLowerCase()
                  : this.state.response.compound > 0.05
                  ? "VADER indicates that your text is positive"
                  : "VADER indicates that your text is negative"}
              </h4>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(Playground);
