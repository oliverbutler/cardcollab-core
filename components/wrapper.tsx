// @ts-nocheck
import { AccountContext } from "context/account";
import { useContext, useEffect } from "react";
import { initGA, logPageView } from "util/analytics";
import refreshFetch from "util/refreshFetch";

const Wrapper = ({ children }) => {
  const { state, dispatch } = useContext(AccountContext);


  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView("/");

    if (localStorage.getItem('accessToken'))
      refreshFetch('/user', { type: "GET", token: true }).then((res) => {
        dispatch({
          type: "FOUND_SESSION",
          payload: res,
        })
      }).catch((err) => console.log(err))

  }, []);


  return children;
};

export default Wrapper;
