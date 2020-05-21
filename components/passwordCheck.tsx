import { useEffect, useState } from "react";
import classnames from "classnames";
import passwordStrength from "components/passwordStrength";

const passportCheck = ({ password }) => {
  return (
    <progress
      className={
        "progress is-small " +
        classnames({
          "is-success": passwordStrength(password) >= 80,
          "is-warning": passwordStrength(password) < 80,
          "is-danger": passwordStrength(password) < 60,
        })
      }
      value={passwordStrength(password)}
      // change class name here
      style={{ height: "5px" }}
      max="100"
    ></progress>
  );
};

export default passportCheck;
