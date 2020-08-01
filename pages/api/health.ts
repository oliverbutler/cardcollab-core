import getConfig from "next/config";
import { checkAuth } from "util/authServer";
import { getUserByID } from "util/db/user";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const health = (req, res) => {
  var userErr = null;
  try {
    checkAuth(req);
  } catch (err) {
    userErr = err.message;
  }

  if (!userErr) {
    getUserByID(req.user.sub).then((user) => {
      const status = {
        localTime: new Date().toLocaleString(),
        universalTime: new Date().toISOString(),
        deployTime: serverRuntimeConfig.DEPLOY_TIME,
        auth: req.user,
        user,
        userErr,
      };
      res.send(status);
    })
  }

  else {
    const status = {
      localTime: new Date().toLocaleString(),
      universalTime: new Date().toISOString(),
      deployTime: serverRuntimeConfig.DEPLOY_TIME,
      userErr,
    };
    res.send(status);
  }
};

export default health;
