import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

import CopyButton from "./CopyButton";
import SentimentScorePieChart from "./SentimentScorePieChart";
import AnalysisCard from "./AnalysisCard";

//Panel component for Playground, that contains various informational components

export default function Panel(props) {
  let link;
  let endpoint;
  if (props.hasOwnProperty("route")) {
    link =
      props.route === "bayes/"
        ? "https://en.wikipedia.org/wiki/Naive_Bayes_classifier"
        : "https://github.com/cjhutto/vaderSentiment";
        endpoint = props.route === "bayes/" ? "Naive Bayes" : "VADER";
  } else {
    link = props.link;
    endpoint = props.route;
  }
  const data = props.response;

  return (
    <div>
      <Row style={{ marginTop: "2rem" }}>
        <Col md={4}>
          <AnalysisCard
            req={props.req}
            endpoint={endpoint}
            api={props.api}
            text={props.text}
            data={data}
            link={link}
          />
        </Col>
        <Col>
          {props.req && props.api === "Senti" ? (
            <SentimentScorePieChart data={data} route={props.route} />
          ) : null}
        </Col>
      </Row>
      <Row style={{ marginTop: "0rem" }}>
        <Col md={10}>
          <Table
            hidden={!(props.req && props.hasOwnProperty("curl"))} //If cURL not provided, do not render Table
            style={{ textAlign: "left" }}
          >
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
