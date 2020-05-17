import { logPageView } from "util/analytics";
const browse = () => {
  logPageView("/browse");

  return <h1>Browse Cards</h1>;
};

export default browse;
