import React from "react";
import Card from "react-bootstrap/Card";

import Speech from "react-speech";

// eslint-disable-next-line
String.prototype.toSentenceCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
//Converts a string to sentence case e.g. APPLE becomes Apple

export default function AnalysisCard(props) {
  return (
    <Card hidden={!props.req} style={{ textAlign: "left" }}>
      {" "}
      {/*Renders only on client request*/}
      <Card.Body>
        <Card.Title>{props.api}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {props.method}
          {" - "}
          <a
            href={props.link}
            target="_blank"
            className="link"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </Card.Subtitle>

        <h5>{props.req ? props.data.classification.toSentenceCase() : null}</h5>
        <Speech
          textAsButton={true}
          displayText="Listen"
          text={`The sentence, ${props.text}, is ${props.data.classification}.`}
        />
      </Card.Body>
    </Card>
  );
}
