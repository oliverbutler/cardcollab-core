import { render } from "react-dom";
import React, { useState } from "react";
import { useSpring, animated as a } from "react-spring";
import ReactQuill, { Quill } from "react-quill";

export function contents(props) {
  const text = props.value;
  console.log("contents", text);
  return { text };
}

export default contents;
