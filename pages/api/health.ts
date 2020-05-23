import getConfig from "next/config";
import { checkAuth } from "util/auth";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const health = (req, res) => {
  var userErr = null;
  try {
    checkAuth(req);
  } catch (err) {
    userErr = err.message;
  }

  const status = {
    localTime: new Date().toLocaleString(),
    universalTime: new Date().toISOString(),
    deployTime: serverRuntimeConfig.DEPLOY_TIME,
    user: req.user,
    userErr,
  };
  res.send(status);
};

export default health;
