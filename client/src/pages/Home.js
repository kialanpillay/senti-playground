import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Card from "react-bootstrap/Card";
import Icon from "@material-ui/core/Icon";
import "bootstrap/dist/css/bootstrap.min.css";
import masks from "../assets/masks.png";
import Navigation from "../components/Navigation";

import Amplify from "aws-amplify";
import awsconfig from "../aws-exports";

Amplify.configure(awsconfig);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: null,
      data: null,
      ip: null,
    };
  }
  async componentDidMount() {
    let res = await fetch(`https://ipapi.co/json/`);
    const ip = await res.json();
    console.log(ip);
    res = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${ip.latitude}&lon=${ip.longitude}&appid=8941e9cb367f4bb6e1a7311f3ed46c88&units=metric`,
      {
        method: "GET",
      }
    );
    const weather = await res.json();

    res = await fetch("https://pomber.github.io/covid19/timeseries.json");
    const data = await res.json();
    console.log(weather);
    this.setState({ weather: weather, data: data, ip: ip });
  }

  render() {
    return (
      <div className="App">
        <Navigation auth={false} />
        <Container style={{ marginTop: "4rem" }}>
          <Row>
            <Col md={9}>
              <h1 className="heading">Blazingly fast sentiment analysis</h1>
            </Col>
            <Col md={3}>
              <img src={masks} width={250} alt="Theatre Masks"></img>
            </Col>
          </Row>
          <Row style={{ marginTop: "1rem" }}>
            <Col md="auto">
              <h2 className="text">
                A playground to learn about Natural Language Processing.
              </h2>
            </Col>
          </Row>
          <Row style={{ marginTop: "1rem" }}>
            <Col md="auto">
              <Button variant="dark" size="lg" href="/senti">
                Explore
              </Button>
            </Col>
          </Row>
          <Row
            style={{ marginTop: "3rem" }}
            className="justify-content-md-left"
          >
            <Col md={10}>
              <Card style={{ textAlign: "left", height: "10rem" }}>
                <Card.Body>
                  <Card.Title>
                    Remote{" "}
                    <Icon
                      style={{
                        fontSize: 16,
                        color: "#0070f3",
                      }}
                    >
                      games
                    </Icon>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    MiniView -  {new Date().toDateString()}
                  </Card.Subtitle>
                  {this.state.weather !== null ? (
                    <Row style={{ marginTop: "1rem" }}>
                       <Col md="auto">
                        <Icon
                          style={{
                            fontSize: 50,
                            color: "#0070f3",
                          }}
                        >
                          my_location
                        </Icon>
          
                      </Col>
                      <Col md="auto">
                        Location
                        <h5>{this.state.ip.city.toUpperCase()}</h5>
                      </Col>
                      <Col md="auto">
                        Temperature
                        <h5>{this.state.weather.main.temp}&#176;</h5>
                      </Col>
                      <Col md="auto">
                        Weather
                        <h5>{this.state.weather.weather[0].main}</h5>
                      </Col>
                      <Col md="auto">
                        <Icon
                          style={{
                            fontSize: 60,
                            color: "#282c34",
                          }}
                        >
                          masks
                        </Icon>
          
                      </Col>
                      <Col md="auto">
                        Confirmed
                        <h5>
                          {
                            this.state.data[this.state.ip.country_name].slice(
                              -1
                            )[0].confirmed
                          }
                        </h5>
                      </Col>
                      <Col md="auto">
                        Recoveries
                        <h5>
                          {
                            this.state.data[this.state.ip.country_name].slice(
                              -1
                            )[0].recovered
                          }
                        </h5>
                      </Col>
                      <Col md="auto">
                        Deaths
                        <h5>
                          {
                            this.state.data[this.state.ip.country_name].slice(
                              -1
                            )[0].deaths
                          }
                        </h5>
                      </Col>
                    </Row>
                  ) : (
                    <Row style={{ marginTop: "1rem" }}>
                      <Col md="auto">Loading Widget</Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
