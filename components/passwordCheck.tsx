import { useEffect, useState } from "react";
import classnames from "classnames";
import passwordStrength from "components/passwordStrength";

const passportCheck = ({ password }) => {
  const [errorClass, setErrorClass] = useState("");
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    var strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])"
    );
    var mediumRegex = new RegExp(
      "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])|(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])| (?=.*[0-9])(?=.*[a-z])(?=.*[^a-zA-Z0-9])"
    );
    var lowRegex = new RegExp(
      "^((?=.*[a-z])(?=.*[A-Z]))|((?=.*[0-9])(?=.*[a-z]))|((?=.*[0-9])(?=.*[A-Z]))"
    );
    var multiplier = 2;
    if (strongRegex.test(password)) {
      multiplier = 9;
    } else if (mediumRegex.test(password)) {
      multiplier = 7;
    } else if (lowRegex.test(password)) {
      multiplier = 5;
    }
    setStrength(multiplier * password.length);

    if (strength >= 80) {
      setErrorClass("is-success");
      setMessage(
        "Seems good! But make sure you haven't included any person information"
      );
    }
    if (strength < 80) {
      setErrorClass("is-warning");
      setMessage("Try increase the complexity more, you'll thank us.");
    }
    if (strength < 60) {
      setErrorClass("is-danger");
      setMessage("Very weak password, you must increase its complexity.");
    }
  }, [password]);

  return (
    <>
      <progress
        className={"progress is-small " + errorClass}
        value={strength}
        style={{ height: "5px", marginBottom: 0 }}
        max="100"
      ></progress>
      <p className={"help " + errorClass}>{message}</p>
    </>
  );
};

export default passportCheck;
