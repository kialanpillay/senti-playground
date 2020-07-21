import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { AmplifySignOut } from "@aws-amplify/ui-react";

export default function Navigation(props) {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">
        <h3>Playground</h3>
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="/playground/senti">Senti API</Nav.Link>
        <Nav.Link href="/playground/all">AWS Comprehend</Nav.Link>
      </Nav>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          <h5 className="username">Signed in as {props.username}</h5>
        </Navbar.Text>

        {props.auth ? null : null}
      </Navbar.Collapse>
    </Navbar>
  );
}
