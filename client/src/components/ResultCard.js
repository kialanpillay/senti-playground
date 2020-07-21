import React from "react";
import Card from "react-bootstrap/Card";

import Speech from "react-speech";

export default function ResultCard(props) {
  return (
    <Card hidden={!props.req} style={{ textAlign: "left" }}>
      <Card.Body>
        <Card.Title>Sentiment Analysis by {props.api}</Card.Title>
        <Card.Subtitle
          className="mb-2 text-muted"
        >
          {props.method}{" - "}
          <a
            href={props.link}
            target="_blank"
            className="link"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </Card.Subtitle>

        <h5>{props.req ? props.data.classification : null}</h5>
        <Speech
          textAsButton={true}
          displayText="Listen"
          text={`The sentence, ${props.text}, is ${props.data.classification}.`}
        />
      </Card.Body>
    </Card>
  );
}
