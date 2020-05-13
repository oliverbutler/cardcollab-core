import { AccountContext } from "context/account";
import { useContext, useEffect } from "react";

import Auth from "@aws-amplify/auth";
import Amplify from "@aws-amplify/core";
import { awsConfig } from "awsConfig";
Amplify.configure(awsConfig);

const Wrapper = ({ children }) => {
  const { state, dispatch } = useContext(AccountContext);

  useEffect(() => {
    async function getUser() {
      try {
        const user = await Auth.currentUserInfo();
        dispatch({ type: "FOUND_SESSION", payload: user.attributes });
        console.log(state);
      } catch (err) {
        console.log("no user");
      }
    }

    if (!state.user) {
      getUser();
    }
  }, []);

  return children;
};

export default Wrapper;
