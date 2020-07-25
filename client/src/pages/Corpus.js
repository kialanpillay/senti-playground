import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ProgressBar from "react-bootstrap/ProgressBar";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Toast from "react-bootstrap/Toast";
import "bootstrap/dist/css/bootstrap.min.css";

import Amplify, { Auth, Hub } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../aws-exports";
import ReactWordcloud from "react-wordcloud";

import Navigation from "../components/Navigation";
import words from "../assets/words";

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

//Word cloud display options
const cloud_options = {
  colors: ["silver", "black", "#282c34", "orange"],
  deterministic: false,
  enableTooltip: false,
  fontFamily: "monospace",
  fontSizes: [50, 50],
  padding: 1,
  rotations: 2,
  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000,
};

class Corpus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      auth: false,
      phrase: "",
      sentiment: "",
      count: 0,
      show: false,
    };
    //Hander binding
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setSentiment = this.setSentiment.bind(this);
    this.setShow = this.setShow.bind(this);
  }
  //Sets state boolean variable for displaying Toast
  setShow = () => {
    this.setState({ show: !this.state.show });
  };
  //Sets sentiment variable for user phrase submission
  setSentiment = (value) => {
    this.setState({ sentiment: value });
  };
  //Handles user text input
  handleChange = (event) => {
    this.setState({ phrase: event.target.value, show: false });
  };
  //Handles user submission; makes POST request to /corpus endpoint
  handleSubmit = () => {
    const data = {
      user: this.state.username,
      phrase: this.state.phrase,
      sentiment: this.state.sentiment,
    };
    this.setState({ phrase: "", show: true });
    let url = `${api}corpus`;
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };
  //Gets authenticated user
  async componentDidMount() {
    let user = await Auth.currentAuthenticatedUser();
    this.setState({ username: user.username, auth: true });
    this.getItemCount();
  }
  //Gets corpus submission count from Senti API endpoint for progress bar
  getItemCount = () => {
    let url = `${api}corpus`;
    fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          count: result.count,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="App">
        <Navigation username={this.state.username} auth={this.state.auth} />
        <Container style={{ marginTop: "4rem" }}>
          <Row>
            <Col md={10}>
              <h1 className="heading" onClick={() => this.handleSubmit()}>
                The Corpus Project
              </h1>
            </Col>
          </Row>
          <Row style={{ marginTop: "0rem" }}>
            <Col md="auto">
              <h2 className="text">
                Help improve our classifiers by contributing to our Gen Z
                lexicon.
              </h2>
            </Col>
          </Row>
          <Row style={{ marginTop: "3rem" }}>
            <Col md={2}>
              <ListGroup>
                <ListGroup.Item
                  action
                  onClick={() => this.setSentiment("Positive")}
                >
                  Positive
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  onClick={() => this.setSentiment("Negative")}
                >
                  Negative
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={8}>
              <InputGroup className="mb-3" size="lg">
                <FormControl
                  placeholder="Your phrase here"
                  onChange={this.handleChange}
                  value={this.state.phrase}
                />
                <InputGroup.Append>
                  <Button
                    variant="outline-secondary"
                    disabled={
                      this.state.sentiment === "" || this.state.text === ""
                    }
                    onClick={() => this.handleSubmit()}
                  >
                    Submit
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <OverlayTrigger
                placement={"top"}
                overlay={
                  <Tooltip>
                    Help Senti to fill this bar! (Count updated daily)
                  </Tooltip>
                }
              >
                <ProgressBar variant="dark" now={this.state.count} />
              </OverlayTrigger>
            </Col>
            <Col>
              <Toast show={this.state.show} onClose={() => this.setShow()}>
                <Toast.Header>
                  <strong className="mr-auto">Senti</strong>
                  <small>Now</small>
                </Toast.Header>
                <Toast.Body>Success! Thank you for contributing!</Toast.Body>
              </Toast>
            </Col>
          </Row>
          <Row style={{ marginTop: "1rem" }}>
            <Col md={8}>
              <ReactWordcloud options={cloud_options} words={words} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(Corpus);
