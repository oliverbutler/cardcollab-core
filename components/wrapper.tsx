import Pool from "util/cognito/userPool";
import { AccountContext } from "context/account";
import { useContext, useEffect } from "react";
import { ICognitoUserSessionData } from "amazon-cognito-identity-js";

const Wrapper = ({ children }) => {
  const { state, dispatch } = useContext(AccountContext);

  useEffect(() => {
    if (!state.user) {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession((err, session: ICognitoUserSessionData) => {
          if (err) {
            console.log("errrr");
            console.log(err);
          } else {
            console.log("got session");
            //@ts-ignore
            var payload = session.getIdToken().payload;
            dispatch({
              type: "FOUND_SESSION",
              payload: payload,
            });
          }
        });
      }
    }
  }, [state]);

  return children;
};

export default Wrapper;
