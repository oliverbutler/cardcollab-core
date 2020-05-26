import { Card } from "components/flipCard";
import React, { useState, useCallback } from "react";

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
  const handleChange = (val) => {
    console.log(val);
    setValue(val);
  };

  return (
    <div>
      <div className="columns">
        <div className="column"></div>
        <div className="column">
          <center>
            <Card name="c" display={value} />
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
      {value}
      <td dangerouslySetInnerHTML={{ __html: value }} />{" "}
    </div>
  );
};

export default about;

// text
