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
      articles: [],
      classification: [],
      positiveArticles: 0,
      negativeArticles: 0,
      neutralArticles: 0,
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
    this.getNews(ip.country_code.toLowerCase());
  }

  processResponse = () => {
    this.state.classification.forEach(item => {
        if(item.classification === "Positive"){
            this.setState({positiveArticles: this.state.positiveArticles + 1})
        }
        else if(item.classification === "Negative"){
            this.setState({negativeArticles: this.state.negativeArticles + 1})
        }
        else{
            this.setState({neutralArticles: this.state.neutralArticles + 1})
        }
    });
  };

  processArticles = () => {
    const documents = this.state.articles.map((article) => {
      return {
        text: article.title,
      };
    });
    return {documents};
  };

  getNews = (code) => {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=${code}&apiKey=e3c7d810af0e41dd869013ab5c5d66e9`
    )
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          articles: result.articles,
        });
      })
      .then(() => this.bulkSentimentAnalysis())
      .catch(function (error) {
        console.log(error);
      });
  };

  bulkSentimentAnalysis = () => {
    const url = `${api}bulk`;
    const payload = this.processArticles();
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          classification: result.bulkClassification,
        });
      })
      .then(() => this.processResponse())
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
              <h2 className="text" hidden={this.state.country === ""}>
                Senti explores the latest headlines from {this.state.country}
              </h2>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(Newsreel);
