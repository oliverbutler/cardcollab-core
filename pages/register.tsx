import React, { useState } from "react";
import UserPool from "util/cognito/userPool";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { getToast } from "util/functions";
import { useRouter } from "next/router";

export default () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();

    var attributeList: CognitoUserAttribute[] = [];
    attributeList.push(
      new CognitoUserAttribute({ Name: "preferred_username", Value: userName })
    );
    attributeList.push(
      new CognitoUserAttribute({ Name: "birthdate", Value: birthDate })
    );
    attributeList.push(
      new CognitoUserAttribute({ Name: "given_name", Value: givenName })
    );
    attributeList.push(
      new CognitoUserAttribute({ Name: "family_name", Value: familyName })
    );

    UserPool.signUp(email, password, attributeList, null, (err, data) => {
      if (err) {
        console.error(err);
        getToast().fire({ icon: "error", title: "Invalid form" });
      } else {
        getToast().fire({ icon: "info", title: "Confirm your email" });
        router.push("/");
      }
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <form onSubmit={onSubmit} className="login-form">
        <label>
          Email:
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label>
          Username:
          <input
            value={userName}
            onChange={(event) => setUserName(event.target.value)}
          />
        </label>

        <label>
          First Name:
          <input
            value={givenName}
            onChange={(event) => setGivenName(event.target.value)}
          />
        </label>

        <label>
          Last Name:
          <input
            value={familyName}
            onChange={(event) => setFamilyName(event.target.value)}
          />
        </label>

        <label>
          Date of Birth:
          <input
            type="date"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};
