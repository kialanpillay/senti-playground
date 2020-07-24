import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Icon from "@material-ui/core/Icon";
import "bootstrap/dist/css/bootstrap.min.css";

import Amplify, { Auth, Hub } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "../aws-exports";

import Navigation from "../components/Navigation";
import NewsPieChart from "../components/NewsPieChart";
import NewsBarChart from "../components/NewsBarChart";
import articles from "../assets/articles";

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
      req: false,
    };
  }

  async componentDidMount() {
    let user = await Auth.currentAuthenticatedUser();
    this.setState({
      username: user.username,
      auth: true,
    });
    const res = await fetch(`https://ipapi.co/json/`);
    const ip = await res.json();
    this.setState({
      country: ip.country_name,
    });
    //this.getNews(ip.country_code.toLowerCase());
    this.getSampleNews();
  }

  processResponse = () => {
    this.state.classification.forEach((item) => {
      if (item.classification === "Positive") {
        this.setState({ positiveArticles: this.state.positiveArticles + 1 });
      } else if (item.classification === "Negative") {
        this.setState({ negativeArticles: this.state.negativeArticles + 1 });
      } else {
        this.setState({ neutralArticles: this.state.neutralArticles + 1 });
      }
    });
    this.setState({
      req: true,
    });
  };

  processArticles = () => {
    const documents = this.state.articles.map((article) => {
      return {
        text: article.title,
      };
    });
    return { documents };
  };

  getSampleNews = () => {
    this.setState({
      articles: articles,
    });
    this.bulkSentimentAnalysis();
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
        <Container
          style={{ marginTop: "4rem" }}
          hidden={this.state.country === ""}
        >
          <Row>
            <Col md={10}>
              <h1 className="heading" onClick={() => this.handleSubmit()}>
                Newsreel
                <Icon
                  style={{
                    fontSize: 64,
                    color: "orange",
                  }}
                >
                  library_books
                </Icon>
              </h1>
            </Col>
          </Row>
          <Row style={{ marginTop: "0rem" }}>
            <Col md="auto">
              <h2 className="text">
                Senti explores the top headlines from {this.state.country} using
                bulk analysis.
              </h2>
            </Col>
          </Row>
          <Row style={{ marginTop: "2rem" }} hidden={this.state.req}>
            <Col md="auto">
              <Spinner animation="grow" />
            </Col>
            <Col md="auto">
              <h3 className="text">Analysing Headlines</h3>
            </Col>
          </Row>
          <Row style={{ marginTop: "2rem" }} hidden={!this.state.req}>
            <Col md={6}>
              <Card style={{ textAlign: "left" }}>
                <Card.Header>Selection of Headlines</Card.Header>
                <ListGroup variant="flush">
                  {this.state.articles.slice(0, 6).map((article, index) => {
                    return (
                      <ListGroup.Item>
                        <a
                          key={index}
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "black" }}
                        >
                          {article.title.length < 60 ? article.title : article.title.substring(0, 60)+ "..."}
                        </a>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card>
            </Col>
            <Col md="auto" style={{ marginRight: "2rem" }}>
              <Card style={{ textAlign: "left" }}>
                <Card.Header>Sentiment</Card.Header>
                <ListGroup variant="flush">
                  {this.state.classification.slice(0, 6).map((item) => {
                    return (
                      <ListGroup.Item>{item.classification}</ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card>
            </Col>
            <Col md={2}>
              <NewsBarChart
                positive={this.state.positiveArticles}
                negative={this.state.negativeArticles}
                neutral={this.state.neutralArticles}
              />
              <NewsPieChart
                positive={this.state.positiveArticles}
                negative={this.state.negativeArticles}
                neutral={this.state.neutralArticles}
              />
            </Col>
            <Col md="auto">
              <Card style={{ textAlign: "left" }}>
                <Card.Body>
                  <h1 className="digit">{this.state.positiveArticles}</h1>
                  <h4>Positive</h4>
                  <h1 className="digit">{this.state.negativeArticles}</h1>
                  <h4>Negative</h4>
                  <h1 className="digit">{this.state.neutralArticles}</h1>
                  <h4>Neutral</h4>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withAuthenticator(Newsreel);
