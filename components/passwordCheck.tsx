import { useEffect, useState } from "react";
import classnames from "classnames";

const passportCheck = ({ password }) => {

  return (
    <progress
      className={

          

        "progress is-small " +
        classnames({
          "is-success": passwordStrength(password) > 80,
          "is-warning": passwordStrength(password) < 80,
          "is-danger": passwordStrength(password) < 60,
        })
      }
      value= {passwordStrength(password)}

      // change class name here 
      style={{ height: "5px" }}
      
      
      max="100"
    ></progress>
  );
};

function passwordStrength(pw)
{

  var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
  var mediumRegex = new RegExp("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])");
  var lowRegex = new RegExp("^((?=.*[a-z])(?=.*[A-Z]))|((?=.*[0-9])(?=.*[a-z]))|((?=.*[0-9])(?=.*[A-Z]))");
  var multiplier = 2;
if(strongRegex.test(pw)) {
    multiplier=8;
} 
else if(mediumRegex.test(pw)) {
    multiplier=6;
} 
else if(lowRegex.test(pw))
{
  multiplier=4;
}
return multiplier*pw.length;
}
export default passportCheck;
