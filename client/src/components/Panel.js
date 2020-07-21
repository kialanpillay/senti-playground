import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

import CopyButton from "./CopyButton";
import SentimentScorePieChart from "./SentimentScorePieChart";

import Speech from "react-speech";

export default function Panel(props) {
  return (
    <div>
      <Row style={{ marginTop: "2rem" }}>
        <Col md={6}>
          <Card hidden={!props.req} style={{ textAlign: "left" }}>
            <Card.Body>
              <Card.Title>Sentiment Analysis by {props.api}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted" hidden={props.api !== "Senti"}>
                {props.route === "bayes/"
                  ? "Naive Bayes Method - "
                  : "VADER Method - "}{" "}
                <a
                  href={
                    props.route === "bayes/"
                      ? "https://en.wikipedia.org/wiki/Naive_Bayes_classifier"
                      : "https://github.com/cjhutto/vaderSentiment"
                  }
                  target="_blank"
                  className="link"
                  rel="noopener noreferrer"
                >
                  Learn More
                </a>
              </Card.Subtitle>

              <h5>
                {props.req ? props.response.classification : null}
              </h5>
              <Speech
                textAsButton={true}
                displayText="Listen"
                text={`The sentence, ${props.text}, is ${props.response.classification}.`}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col>
          {props.req ? (
            <SentimentScorePieChart
              data={props.response}
              route={props.route}
            />
          ) : null}
        </Col>
      </Row>
      <Row style={{ marginTop: "0rem" }}>
        <Col md={10}>
          <Table hidden={!(props.req && props.api !== "AWS")} style={{ textAlign: "left" }}>
            <thead>
              <tr>
                <th style={{ borderTop: "0px", borderBottom: "2px" }}>
                  <CopyButton handler={props.copyHandler} /> cURL Command
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="code">{props.curl}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
}
