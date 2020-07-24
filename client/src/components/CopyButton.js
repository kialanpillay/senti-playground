import React from "react";
import Icon from "@material-ui/core/Icon";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

//Custom icon button for copying to clipboard
export default function CopyButton(props) {
  return (
    <OverlayTrigger
      placement={"top"}
      overlay={<Tooltip>Click to copy cURL command.</Tooltip>}
    >
      <Icon
        style={{
          fontSize: 20,
          color: "orange",
        }}
        onClick={props.handler}
      >
        content_copy
      </Icon>
    </OverlayTrigger>
  );
}
