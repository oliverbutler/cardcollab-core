import { Card } from "components/flipCard";
import React, { useState, useCallback } from "react";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    //[{ size: [] }],
    [
      "bold",
      "italic",
      "underline",
      "strike",
      //, blockquote"
    ],
    [
      { list: "ordered" },
      //{ list: "bullet" },
      // { indent: "-1" },
      // { indent: "+1" },
    ],
    [
      "link",
      "image",
      //, "video"
    ],
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
  //"size",
  "bold",
  "italic",
  "underline",
  "strike",
  // "blockquote",
  "list",
  // "bullet",
  //"indent",
  "link",
  "image",
  //"video",
];

const about = () => {
  var val;
  const [valuef, setValuef] = useState("");
  const [valueb, setValueb] = useState("");

  const ReactQuill =
    typeof window === "object" ? require("react-quill") : () => false;
  const handleChangef = (val) => {
    setValuef(parser(val));
  };
  const handleChangeb = (val) => {
    setValueb(parser(val));
  };

  return (
    <div>
      <div className="columns">
        <div className="column"></div>
        <div className="column">
          <center>
            <Card name="c" displayf={valuef} displayb={valueb} />
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
          onChange={handleChangef}
        />
        <ReactQuill
          name="editor"
          modules={modules}
          formats={formats}
          theme="snow"
          onChange={handleChangeb}
        />
      </div>
    </div>
  );
};

function parser(text) {
  if (text.match(new RegExp(/##image##/))) {
    console.log("image enabled");
    text = text.replace(new RegExp("&lt;img", "g"), "<img");
    text = text.replace(new RegExp("/&rt;", "g"), ">");
    text = text.replace("##image##", " ");
  }

  text = text.replace(new RegExp("h1", "g"), "p class='title'");
  text = text.replace(new RegExp("h2", "g"), "p class='subtitle'");
  text = text.replace(
    new RegExp('class="ql-font-serif"', "g"),
    " style = 'font-family:georgia,garamond,serif;'"
  );

  text = text.replace(
    new RegExp(' class="ql-font-monospace"', "g"),
    " style = 'font-family: Lucida Console, Courier, monospace;'"
  );
  text = text.replace(new RegExp("img", "g"), "img max-height='200px'");

  return text;
}

export default about;

// text
