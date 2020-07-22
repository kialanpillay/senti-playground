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
        <Nav.Link href="/engine">Sentiment Engine</Nav.Link>
        <Nav.Link href="/newsreel">Newsreel</Nav.Link>
        <Nav.Link href="/corpus">Corpus Project</Nav.Link>
      </Nav>
      <Navbar.Collapse className="justify-content-end" >
        <Navbar.Text hidden={!props.auth}>
          <h6 className="username">Welcome, {props.auth ? props.username : null}</h6>
        </Navbar.Text>

        {props.auth ? <AmplifySignOut onClick/> : null}
      </Navbar.Collapse>
    </Navbar>
  );
}