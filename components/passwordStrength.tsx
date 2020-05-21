import { useEffect, useState } from "react";
import classnames from "classnames";
function passwordStrength(pw) {
  var strongRegex = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
  );
  var mediumRegex = new RegExp(
    "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])|(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])| (?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*])"
  );
  var lowRegex = new RegExp(
    "^((?=.*[a-z])(?=.*[A-Z]))|((?=.*[0-9])(?=.*[a-z]))|((?=.*[0-9])(?=.*[A-Z]))"
  );
  var multiplier = 2;
  if (strongRegex.test(pw)) {
    multiplier = 8;
  } else if (mediumRegex.test(pw)) {
    multiplier = 6;
  } else if (lowRegex.test(pw)) {
    multiplier = 4;
  }
  return multiplier * pw.length;
}
export default passwordStrength;
