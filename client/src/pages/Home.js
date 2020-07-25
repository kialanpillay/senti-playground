import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Icon from "@material-ui/core/Icon";
import "bootstrap/dist/css/bootstrap.min.css";
import masks from "../assets/masks.png";
import Navigation from "../components/Navigation";

import Amplify, { Auth, Hub } from "aws-amplify";
import awsconfig from "../aws-exports";

Amplify.configure(awsconfig);

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weather: null,
      data: null,
      ip: null,
      auth: false,
      user: "",
    };
    Hub.listen("auth", this.listener); //Hub for listening to auth events
  }

  listener = (data) => {
    if (data.payload.event === "signOut") {
      this.setState({ username: "", auth: false });
    }
  };

  //Checks if user is authenticated (logged-in)
  authenticate = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        this.setState({ username: user.username, auth: true });
      })
      .catch(() => {
        this.setState({ username: "", auth: false });
      });
  };

  //Asynchronously retrieves location information and current weather data for render in Remote widget
  async componentDidMount() {
    this.authenticate();
    let res = await fetch(`https://ipapi.co/json/`);
    const ip = await res.json();
    res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${ip.latitude}&lon=${ip.longitude}&appid=8941e9cb367f4bb6e1a7311f3ed46c88&units=metric`,
      {
        method: "GET",
      }
    );
    const weather = await res.json();

    res = await fetch("https://api.covid19api.com/total/country/south-africa", {
      method: "GET",
    });
    const data = await res.json();
    this.setState({ weather: weather, data: data, ip: ip });
  }

  render() {
    return (
      <div className="App">
        <Navigation auth={this.state.auth} username={this.state.username} />
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
            <Col md={11}>
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
                    MiniView - {new Date().toDateString()}
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
                        <h5>{this.state.data.slice(-1)[0].Confirmed}</h5>
                      </Col>
                      <Col md="auto">
                        Recoveries
                        <h5>{this.state.data.slice(-1)[0].Recovered}</h5>
                      </Col>
                      <Col md="auto">
                        Deaths
                        <h5>{this.state.data.slice(-1)[0].Deaths}</h5>
                      </Col>
                    </Row>
                  ) : (
                    <Row style={{ marginTop: "1rem" }}>
                      <Col md="auto">
                        <Spinner animation="grow" size="sm" />
                      </Col>
                      <Col>Loading Widget</Col>
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
