// @ts-nocheck
import React, { useState, useEffect } from "react";
import { AccountContext } from "context/account";
import { useContext } from "react";
import Router from "next/router";
import { getToast } from "util/functions";
import Link from "next/link";
import Auth from "@aws-amplify/auth";

export default () => {
  const { state, dispatch } = useContext(AccountContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const user = await Auth.signIn(email, password);
      console.log(user);
      dispatch({
        type: "LOG_IN",
        payload: (await Auth.currentUserInfo()).attributes,
      });
      getToast().fire({ icon: "success", title: "Logged In! 🎉" });
    } catch (err) {
      console.log(err);
      if (err.name == "UserNotConfirmedException") {
        getToast().fire({ icon: "warning", title: "Email not confirmed" });
      } else {
        getToast().fire({ icon: "error", title: "Invalid email or password" });
      }
    }
  };

  // useEffect(() => {
  //   Hub.listen("auth", ({ payload: { event, data } }) => {
  //     switch (event) {
  //       case "signIn":
  //         console.log("success");
  //         console.log(data);
  //         break;
  //       case "signOut":
  //         console.log("failure");
  //         break;
  //       case "customOAuthState":
  //         console.log("custom oauth state");
  //         console.log(data);
  //     }
  //   });
  // }, []);

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
      {/* <button onClick={() => Auth.federatedSignIn({ provider: "Google" })}>  todo: get this working 
         Open Google
      </button> */}
      <Link href="/register">
        <a>Or Register</a>
      </Link>
    </div>
  );
};
