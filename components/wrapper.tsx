// @ts-nocheck
import { AccountContext } from "context/account";
import { useContext, useEffect } from "react";
import { initGA, logPageView } from "util/analytics";
import { getAccessToken } from "util/functions"

const Wrapper = ({ children }) => {
  const { state, dispatch } = useContext(AccountContext);

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView("/");


    if (getAccessToken()) {
      // Check access token isn't expired before doing this

      const requestOptions = {
        method: "GET",
        headers: { "Authorization": "Bearer " + localStorage.getItem('accessToken'), "Content-Type": "application/json" },
      };

      // console.log(requestOptions)


      // OR make a custom hook which will refresh if invalid
      fetch('http://localhost:3000/api/user', requestOptions)
        .then((res) => res.json())
        .then(res => {
          dispatch({
            type: "FOUND_SESSION",
            payload: res,
          });
        })
        .catch(err => console.log(err))

    }

  }, []);


  return children;
};

export default Wrapper;
