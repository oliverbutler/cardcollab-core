import React, { useState, useEffect } from "react";
import { AccountContext } from "context/account";
import { useContext } from "react";
import Router from "next/router";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import Pool from "util/cognito/userPool";
import Swal from "sweetalert2";
import { getToast } from "util/functions";
import Link from "next/link";

export default () => {
  const { state, dispatch } = useContext(AccountContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    const user = new CognitoUser({
      Username: email,
      Pool: Pool,
    });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        Router.push("/");
        console.log("onSuccess:", data);
        //@ts-ignore
        var user = data.getIdToken().payload;
        dispatch({ type: "LOG_IN", payload: user });
      },

      onFailure: (err) => {
        console.error("onFailure:", err);
        getToast().fire({
          icon: "error",
          title: "Incorrect Email or Password",
        });
      },

      newPasswordRequired: (data) => {
        console.log("newPasswordRequired:", data);

        getToast().fire(
          "We have emailed you.",
          "You need a new password, we have emailed you",
          "warning"
        );
      },
    });
  };

  useEffect(() => {
    if (state.user) Router.push("/");
  }, [state.user]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Sign In</h1>
      <form onSubmit={onSubmit} className="login-form">
        <label>
          Email:
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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

        <button type="submit">Login</button>
      </form>
      <Link href="/register">
        <a>Or Register</a>
      </Link>
    </div>
  );
};
