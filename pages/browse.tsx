import { logPageView } from "util/analytics";
const browse = () => {
  logPageView("/browse");

  return (
    <div className="container">
      <h1 className="title">Browse Cards</h1>
    </div>
  );
};

export default browse;
