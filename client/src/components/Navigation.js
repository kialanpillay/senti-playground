import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { AmplifySignOut } from "@aws-amplify/ui-react";

export default function Navigation(props) {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">
        <span>
          <h3 className="brand">SENTI</h3>
        </span>
      </Navbar.Brand>
      <Nav className="mr-auto" hidden={!props.auth}>
        <Nav.Link href="/senti">Senti Playground</Nav.Link>
        <Nav.Link href="/all">Sentiment Engine</Nav.Link>
      </Nav>
      <Navbar.Collapse className="justify-content-end" >
        <Navbar.Text hidden={!props.auth}>
          <h5 className="username">Signed in as {props.auth ? props.username : null}</h5>
        </Navbar.Text>

        {props.auth ? null : null}
      </Navbar.Collapse>
    </Navbar>
  );
}
