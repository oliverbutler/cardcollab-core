import { logPageView } from "util/analytics";
import { Deck } from "components/deckCard";
import { Card } from "components/flipCard";
import { render } from "react-dom";
import React, { useState, useCallback } from "react";
import { useTransition, animated } from "react-spring";
import ReactQuill from "react-quill";
import Editor from "components/editor/editor";

const decks = [
  {
    title: "Algorithms and Design",
    author: "Jonno",
    description: "Algorithm and design flash cards for CSC2023",
    userType: "Admin",
    showAuthor: true,
    url:
      "https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80",
  },
  {
    title: "Operating Systems",
    author: "Sam",
    description: "Operating systems module",
    userType: "Pro",
    url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80",
  },
  {
    title: "Web Development",
    author: "Laura",
    description: "Web development with XHTML",
    userType: "Free",
    url:
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80",
  },
];

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

const about = () => {
  var val;
  const [value, setValue] = useState("");
  const ReactQuill =
    typeof window === "object" ? require("react-quill") : () => false;
  const handleChange = (value) => {
    console.log(value);
    setValue(value);
  };

  return (
    <div>
      <div className="columns">
        <div className="column"></div>
        <div className="column">
          //**** */ @ts-ignore:
          <center>
            <Card name="c" display={value} />
            // @ts-ignore:
          </center>
        </div>
        <div className="column"></div>
      </div>
      <div className="container">
        <ReactQuill
          name="editor"
          modules={modules}
          formats={formats}
          theme="snow"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default about;
