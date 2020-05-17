// utils/analytics.js
import ReactGA from "react-ga";
export const initGA = () => {
  console.log("GA init");
  ReactGA.initialize("UA-158863202-1");
};
export const logPageView = (page: string) => {
  // console.log(`Logging pageview for ${window.location.pathname}`);
  // ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(page);
};
export const logEvent = (category = "", action = "") => {
  if (category && action) {
    console.log("ℹ️Logged > " + category + " " + action);
    ReactGA.event({ category, action });
  }
};
export const logException = (description = "", fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};
