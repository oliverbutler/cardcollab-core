import getConfig from "next/config";
import dbConnect from "middleware/db";
import mongoose from "mongoose";

import { capitalize } from "util/functions";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const health = (req, res) => {
  const status = {
    mongooseConn: mongoose.connection.readyState,
    mongooseModels: mongoose.modelNames(),
    systemTime: new Date(Date.now()).toLocaleString(),
    deployTime: serverRuntimeConfig.DEPLOY_TIME,
  };
  res.send(status);
};

export default dbConnect(health);
