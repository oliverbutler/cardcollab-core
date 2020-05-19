// @ts-nocheck
import React, { useState, useEffect } from "react";
import { AccountContext } from "context/account";
import { useContext } from "react";
import Router from "next/router";
import { getToast } from "util/functions";
import Auth from "@aws-amplify/auth";
import Link from "next/link";
import { motion } from "framer-motion";
import { logEvent, logPageView } from "util/analytics";

export default () => {
  const { state, dispatch } = useContext(AccountContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  logPageView("/login");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const user = await Auth.signIn(email, password);
      console.log(user);
      dispatch({
        type: "LOG_IN",
        payload: (await Auth.currentUserInfo()).attributes,
      });
      setLoading(false);
      logEvent("login", email + " logged in");
      getToast().fire({ icon: "success", title: "Logged In! 🎉" });
    } catch (err) {
      console.log(err);
      setLoading(false);
      if (err.name == "UserNotConfirmedException") {
        getToast().fire({ icon: "warning", title: "Email not confirmed" });
      } else {
        getToast().fire({ icon: "error", title: "Invalid email or password" });
      }
    }
  };

  useEffect(() => {
    if (state.user) Router.push("/profile");
  }, [state.user]);

  return (
    <div className="container">
      <div className="columns is-centered is-vcentered is-mobile">
        <div className="column is-narrow">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="title">Log In</h1>

            <form>
              <div className="field">
                <label className="label">Email</label>
                <div className="control has-icons-left ">
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <span className="icon is-small is-left">
                    <ion-icon name="mail-outline"></ion-icon>
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control has-icons-left ">
                  <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="icon is-small is-left">
                    <ion-icon name="key-outline"></ion-icon>
                  </span>
                </div>
              </div>

              <div className="field is-grouped">
                <div className="control">
                  <button
                    className={
                      "button is-link " + (loading ? "is-loading" : "")
                    }
                    onClick={onSubmit}
                    disabled={!email || !password}
                  >
                    Submit
                  </button>
                </div>
                <div className="control">
                  <Link href="/register">
                    <button className="button is-link is-light">
                      Or Register
                    </button>
                  </Link>
                </div>
              </div>
            </form>
            <Link href="/forgotten">
              <a className="button is-text" style={{ marginTop: "1em" }}>
                Forgot your password
              </a>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
