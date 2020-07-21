import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import masks from "../assets/masks.png";

import Amplify from "aws-amplify";
import awsconfig from "../aws-exports";

Amplify.configure(awsconfig);

class Home extends Component {
  render() {
    return (
      <div className="App">
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/">
            <span>
              <h3 className="brand">SENTI</h3>
            </span>
          </Navbar.Brand>
        </Navbar>
        <Container style={{ marginTop: "6rem" }}>
          <Row>
            <Col md={9}>
              <h1 className="heading">Blazingly fast sentiment analysis</h1>
            </Col>
            <Col md={3}>
              <img src={masks} width={250} alt="Theatre Masks"></img>
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
            <Col md="auto">
              <Button variant="dark" size="lg" href="/playground">
                Explore
              </Button>
            </Col>
          </Row>
          <Row style={{ marginTop: "2rem" }}>
            <Col md="auto">
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
