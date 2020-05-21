//@ts-nocheck
import Auth from "@aws-amplify/auth";
import { SignUpParams } from "@aws-amplify/auth/lib-esm/types";
import PasswordCheck from "components/passwordCheck";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { getToast } from "util/functions";
import { motion } from "framer-motion";
import classNames from "classnames";
import { logEvent, logPageView } from "util/analytics";
import blackList from "components/blackList";

export default () => {
  const router = useRouter();

  logPageView("/register");

  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    var err = false;

    // age verification

    if (!err) {
      //
      event.preventDefault();
      setLoading(true);
      const param: SignUpParams = {
        username: email,
        password,
        attributes: {
          given_name: givenName,
          family_name: familyName,
          birthdate: birthDate,
          preferred_username: userName,
        },
      };

      try {
        const user = await Auth.signUp(param);
        console.log(user);
        setLoading(false);
        router.push("/login");
        logEvent("register", email + " registered");
        getToast().fire({
          icon: "success",
          title: "Successfully Registered!",
          text: "Please confirm your email",
        });
      } catch (err) {
        console.log(err);
        setLoading(false);
        getToast().fire({
          icon: "error",
          title: "Error with your form",
        });
      }
    } else {
      setLoading(false);
    }
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
                  <div className="field">
                    <label className="label">First Name</label>
                    <div className="control has-icons-left ">
                      <input
                        className="input"
                        type="text"
                        value={givenName}
                        onChange={(e) => setGivenName(e.target.value)}
                        className="input"
                      />
                      <span className="icon is-small is-left">
                        <ion-icon name="person-outline"></ion-icon>
                      </span>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Surname</label>
                    <div className="control  ">
                      <input
                        className="input"
                        type="text"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Email</label>
                <div className="control has-icons-left">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${
                      checkEmail(email) ? "input" : "input is-danger"
                    }`}
                  />
                  <span className="icon is-small is-left">
                    <ion-icon name="mail-outline"></ion-icon>
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">Username</label>
                <div className="control has-icons-left">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className={`${
                      checkUsername(userName) ? "input is-danger" : "input"
                    }`}
                  />

                  <span className="icon is-small is-left">
                    <ion-icon name="at-outline"></ion-icon>
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">Date of Birth</label>
                <div className="control has-icons-left">
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className={`${
                      checkDob(birthDate) ? "input is-danger" : "input"
                    }`}
                  />
                  <span className="icon is-small is-left">
                    <ion-icon name="calendar-outline"></ion-icon>
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control has-icons-left">
                  <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="icon is-small is-left">
                    <ion-icon name="key-outline"></ion-icon>
                  </span>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: password ? 1 : 0 }}
                    style={{ paddingTop: 5 }}
                  >
                    <PasswordCheck password={password} />
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: password ? 100 : 0,
                  opacity: password ? 1 : 0,
                }}
                style={{ minHeight: 0 }}
              >
                <div className="field">
                  <label className="label">Verify Password</label>
                  <div className="control has-icons-left">
                    <input
                      className={classNames({
                        input: "is-true",
                        "is-danger": password != password2,
                      })}
                      type="password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                    />
                    <span className="icon is-small is-left">
                      <ion-icon name="key-outline"></ion-icon>
                    </span>
                  </div>
                </div>
              </motion.div>

              <div className="field is-grouped">
                <div className="control">
                  <button
                    className={
                      "button is-link " + (loading ? "is-loading" : "")
                    }
                    disabled={
                      !(
                        givenName &&
                        familyName &&
                        email &&
                        userName &&
                        birthDate &&
                        password &&
                        password == password2
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
function checkUsername(val) {
  // username check
  val = val.toString();
  var err = false;
  blackList.forEach((element) => {
    if (val == element) {
      err = true;
    }
  });
  if (err) {
    console.log(true);
    return true;
  } else {
    console.log(false);
    return false;
  }
}
function checkDob(val) {
  var err = false;
  var year = new Date(val);
  year = year.getFullYear();
  var date = new Date().getFullYear();
  var dif = year - date;
  if (dif < -100) {
    getToast().fire({
      icon: "error",
      title: "Geez How old are you?!?",
    });
    err = true;
  }

  if (dif > 0) {
    getToast().fire({
      icon: "error",
      title: "T-" + dif + " Years till your birth",
    });
    err = true;
  }
  if (err) {
    return true;
  } else {
    return false;
  }
}
function checkEmail(val) {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(val);
}
