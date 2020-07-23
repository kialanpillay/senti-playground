import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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

class Newsreel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      auth: false,
      country: "",
    };
  }

  async componentDidMount() {
    let user = await Auth.currentAuthenticatedUser();
    const res = await fetch(`https://ipapi.co/json/`);
    const ip = await res.json();
    this.setState({
      username: user.username,
      auth: true,
      country: ip.country_name,
    });
    this.getNews();
  }

  getNews = () => {
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
                Newsreel
              </h1>
            </Col>
          </Row>
          <Row style={{ marginTop: "0rem" }}>
            <Col md="auto">
              <h2 className="text" hidden={this.state.country === ""}>Senti analyses the latest headlines from {this.state.country}</h2>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(Newsreel);
