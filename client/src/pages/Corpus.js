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
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../aws-exports";

import Navigation from "../components/Navigation";

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

class Corpus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      auth: false,
      phrase: "TestJS",
      sentiment: "Negative"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    this.setState({ text: event.target.value, req: false });
  };

  handleSubmit = () => {
    const data = {
        user: this.state.username,
        phrase: this.state.phrase,
        sentiment: this.state.sentiment,
    }
    console.log(data)
    let url = `${api}corpus`;
    fetch(url, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
     body: JSON.stringify(data)
  
    })
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
              <h1 className="heading" onClick={() => this.handleSubmit()}>The Corpus Project</h1>
            </Col>
          </Row>
          <Row style={{ marginTop: "0rem" }}>
            <Col md="auto">
              <h2 className="text">
                Help build Senti by contributing to our Gen Z lexicon.
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
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(Corpus);
