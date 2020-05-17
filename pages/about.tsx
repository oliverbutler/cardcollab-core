import { logPageView } from "util/analytics";

const about = () => {
  logPageView("/about");
  return (
    <div className="container">
      <h1 className="title">About Page</h1>
    </div>
  );
};

export default about;
