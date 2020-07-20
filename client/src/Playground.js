import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";

import Amplify, { Auth, Hub } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

const listener = (data) => {
  if (data.payload.event == "signIn") {
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
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAnalysis = this.handleAnalysis.bind(this);
  }

  handleChange = (event) => {
    this.setState({ text: event.target.value });
  };

  handleAnalysis = () => {
    let params = {
      text: this.state.text,
    };

    let query = Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");

    let url = "http://127.0.0.1:5000/senti/" + query;
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
          score: result.score,
          classification: result.classification,
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
            <h3>Senti | Playground</h3>
          </Navbar.Brand>
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
              <h1 className="heading">Welcome to Senti API</h1>
            </Col>
          </Row>
          <Row style={{ marginTop: "2rem" }}>
            <Col md="auto">
              <h2 className="text">
                A playground to learn about Natural Language Processing.
              </h2>
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
                    onClick={() => this.handleAnalysis()}
                  >
                    Analyse
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(Playground);
