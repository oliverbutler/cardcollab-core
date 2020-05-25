// @ts-nocheck
import { AccountContext } from "context/account";
import { useContext, useEffect } from "react";
import { initGA, logPageView } from "util/analytics";

const Wrapper = ({ children }) => {
  const { state, dispatch } = useContext(AccountContext);

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView("/");
  }, []);

  return children;
};

export default Wrapper;
