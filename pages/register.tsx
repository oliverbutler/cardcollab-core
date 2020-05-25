//@ts-nocheck
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { getToast, validateProperty } from "util/functions";
import { motion } from "framer-motion";
import { logEvent, logPageView } from "util/analytics";
import { schema } from "schema/register";
import Input, { InputType } from "components/input";

export default () => {
  const router = useRouter();

  logPageView("/register");

  // Create initial state for formData, this was originally done on the fly, but it throws react errors
  var initialState = {};
  [
    "givenName",
    "familyName",
    "email",
    "username",
    "birthDate",
    "password",
    "password2",
  ].forEach((p) => {
    initialState[p] = { value: "", error: "" };
  });

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [agreed, setAgreed] = useState(false);

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

  // On submit do the rigmarole of signing a user up
  // todo: username + email checking

  const onSubmit = async (event) => {
    // age verification

    //
    event.preventDefault();
    setLoading(true);

    // const param: SignUpParams = {
    //   username: formData.email.value,
    //   password: formData.password.value,
    //   attributes: {
    //     given_name: formData.givenName.value,
    //     family_name: formData.familyName.value,
    //     birthdate: formData.birthDate.value,
    //     preferred_username: formData.username.value,
    //   },
    // };

    // try {
    //   const user = await Auth.signUp(param);
    //   console.log(user);
    //   setLoading(false);
    //   router.push("/login");
    //   logEvent("register", formData.email.value + " registered");
    //   getToast().fire({
    //     icon: "success",
    //     title: "Successfully Registered!",
    //     text: "Please confirm your email",
    //   });
    // } catch (err) {
    //   console.log(err);
    //   setLoading(false);
    //   getToast().fire({
    //     icon: "error",
    //     title: err.message,
    //   });
    // }
  };

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
          <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
            <h1 className="title">Sign Up</h1>
            <form>
              <div className="field">
                <div className="field-body">
                  <Input
                    title="Name"
                    value={formData.givenName.value}
                    error={formData.givenName.error}
                    onChange={(val: string) => handleOnChange(val, "givenName")}
                    iconLeft="person-outline"
                  />
                  <Input
                    title="Surname"
                    value={formData.familyName.value}
                    error={formData.familyName.error}
                    onChange={(val: string) =>
                      handleOnChange(val, "familyName")
                    }
                  />
                </div>
              </div>
              <Input
                title="Email"
                type={InputType.EMAIL}
                value={formData.email.value}
                error={formData.email.error}
                onChange={(val: string) => handleOnChange(val, "email")}
                iconLeft="mail-outline"
              />
              <Input
                title="Username"
                value={formData.username.value}
                error={formData.username.error}
                onChange={(val: string) => handleOnChange(val, "username")}
                iconLeft="at-outline"
              />
              <Input
                title="Date of Birth"
                type={InputType.DATE}
                value={formData.birthDate.value}
                error={formData.birthDate.error}
                onChange={(val: string) => handleOnChange(val, "birthDate")}
                iconLeft="calendar-outline"
              />
              <Input
                title="Password"
                type={InputType.PASSWORD}
                value={formData.password.value}
                error={formData.password.error}
                onChange={(val: string) => handleOnChange(val, "password")}
                iconLeft="key-outline"
                passwordStrength
              />

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: formData.password.value ? 100 : 0,
                  opacity: formData.password.value ? 1 : 0,
                }}
                style={{ minHeight: 0 }}
              >
                <Input
                  title="Verify Password"
                  type={InputType.PASSWORD}
                  value={formData.password2?.value}
                  onChange={(val: string) => handleOnChange(val, "password2")}
                  iconLeft="key-outline"
                  error={
                    formData.password2.value &&
                    formData.password.value != formData.password2.value
                      ? "Passwords don't match"
                      : ""
                  }
                />
              </motion.div>

              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input
                      type="checkbox"
                      value={agreed}
                      onChange={(e) => setAgreed(e.target.value)}
                    />{" "}
                    I agree to the{" "}
                    <Link href="/tos">
                      <a>Terms of Service</a>
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy">
                      <a>Privacy Policy</a>
                    </Link>
                  </label>
                </div>
              </div>

              <div className="field is-grouped">
                <div className="control">
                  <button
                    className={
                      "button is-link " + (loading ? "is-loading" : "")
                    }
                    disabled={
                      !(
                        formData.password.value == formData.password2.value &&
                        agreed &&
                        formValid
                      )
                    }
                    onClick={onSubmit}
                  >
                    Submit
                  </button>
                </div>
                <div className="control">
                  <Link href="/login">
                    <button className="button is-link is-light">
                      Or Log In
                    </button>
                  </Link>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
