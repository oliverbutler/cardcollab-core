import { useEffect, useState } from "react";
import classnames from "classnames";

const passportCheck = ({ password }) => {
  return (
    <progress
      className={
        "progress is-small " +
        classnames({
          "is-success": password.length > 8,
          "is-warning": password.length < 9,
          "is-danger": password.length < 6,
        })
      }
      style={{ height: "5px" }}
      value={password.length * 8}
      max="100"
    ></progress>
  );
};

export default passportCheck;
