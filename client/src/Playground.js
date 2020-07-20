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
import Table from "react-bootstrap/Table";
import Icon from "@material-ui/core/Icon";
import "bootstrap/dist/css/bootstrap.min.css";

import Amplify, { Auth, Hub } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { AmplifySignOut } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";

import copy from "copy-to-clipboard";

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
    this.setState({ text: event.target.value });
  };

  handleAnalysis = (route) => {
    let params = {
      text: this.state.text,
    };
    this.setState({ route: route });
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
                  <Dropdown.Item onClick={() => this.handleAnalysis("bayes/")}>
                    Naive Bayes
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => this.handleAnalysis("vader/")}>
                    VADER
                  </Dropdown.Item>
                </DropdownButton>
              </InputGroup>
            </Col>
          </Row>
          <Row style={{ marginTop: "2rem" }}>
            <Col md={10}>
              <h4 className="text" hidden={!this.state.req}>
                {this.state.route === "bayes/"
                  ? "Naive Bayes indicates that your text is " +
                    this.state.response.compound
                  : this.state.response.compound > 0.05
                  ? "VADER indicates that your text is positive"
                  : "VADER indicates that your text is negative"}
              </h4>
            </Col>
          </Row>
          <Row style={{ marginTop: "2rem" }}>
            <Col md={6}>
              <Table hidden={!this.state.req} style={{ textAlign: "left" }}>
                <thead>
                  <tr>
                    <th>
                      <Icon
                        style={{
                          fontSize: 20,
                          color: "orange",
                        }}
                        onClick={this.handleCopy}
                      >
                        content_copy
                      </Icon>{" "}
                      cURL Command
                    </th>
                    <th>Type</th>
                    <th>Classification</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="code">{this.curlBuilder()}</td>
                    <td>
                      {this.state.route === "bayes/" ? "Naive Bayes" : "VADER"}
                    </td>
                    <td>{this.state.response.compound}</td>
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
