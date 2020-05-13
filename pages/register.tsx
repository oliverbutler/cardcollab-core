//@ts-nocheck
import React, { useState } from "react";
import { getToast } from "util/functions";
import { useRouter } from "next/router";
import Auth from "@aws-amplify/auth";
import { SignUpParams } from "@aws-amplify/auth/lib-esm/types";

export default () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

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
      router.push("/");
      getToast().fire({
        icon: "success",
        title: "Successfully Registered!",
        text: "Please confirm your email",
      });
    } catch (err) {
      console.log(err);
      getToast().fire({ icon: "error", title: "Error with your form" });
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Register</h1>
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
