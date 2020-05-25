import React, { useState, useEffect } from "react";
import { AccountContext } from "context/account";
import { useContext } from "react";
import Router from "next/router";
import { getToast } from "util/functions";
import Link from "next/link";
import { motion } from "framer-motion";
import { logEvent, logPageView } from "util/analytics";
import Input, { InputType } from "components/input";
import { schema } from "schema/login";
import { validateProperty } from "util/functions";

export default () => {
  const { state, dispatch } = useContext(AccountContext);

  var initialState = {};
  ["email", "password"].forEach((p) => {
    initialState[p] = { value: "", error: "" };
  });

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);

  logPageView("/login");

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    // try {
    //   const user = await Auth.signIn(
    //     formData["email"].value,
    //     formData["password"].value
    //   );
    //   console.log(user);
    //   dispatch({
    //     type: "LOG_IN",
    //     payload: (await Auth.currentUserInfo()).attributes,
    //   });
    //   setLoading(false);
    //   logEvent("login", formData["email"].value + " logged in");
    //   getToast().fire({ icon: "success", title: "Logged In! 🎉" });
    // } catch (err) {
    //   console.log(err);
    //   setLoading(false);
    //   if (err.name == "UserNotConfirmedException") {
    //     getToast().fire({ icon: "warning", title: "Email not confirmed" });
    //   } else {
    //     getToast().fire({ icon: "error", title: "Invalid email or password" });
    //   }
    // }
  };

  // Every time form data is updated, check if the form is "valid" aka. no errors
  useEffect(() => {
    var formValid = true;
    Object.keys(formData).forEach((property) => {
      if (formData[property].error || formData[property].value == "") {
        formValid = false;
        return;
      }
    });
    setFormValid(formValid);
  }, [formData]);

  useEffect(() => {
    if (state.user) Router.push("/profile");
  }, [state.user]);

  // On the change of a property, run it through the validator and also
  const handleOnChange = (value: string, property: string) => {
    var err = validateProperty(property, value, schema);
    if (err?.includes("empty")) err = "Cannot be empty";

    setFormData({
      ...formData,
      [property]: {
        value: value,
        error: err,
      },
    });
  };

  return (
    <div className="container">
      <div className="columns is-centered is-vcentered is-mobile">
        <div className="column is-narrow">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="title">Log In</h1>

            <form>
              <Input
                title="Email"
                value={formData["email"].value}
                error={formData["email"].error}
                onChange={(val: string) => handleOnChange(val, "email")}
                iconLeft="mail-outline"
              />
              <Input
                title="Password"
                value={formData["password"].value}
                error={formData["password"].error}
                type={InputType.PASSWORD}
                onChange={(val: string) => handleOnChange(val, "password")}
                iconLeft="key-outline"
              />

              <div className="field is-grouped">
                <div className="control">
                  <button
                    className={
                      "button is-link " + (loading ? "is-loading" : "")
                    }
                    onClick={onSubmit}
                    disabled={!formValid}
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
