import mongoose from "mongoose";

import getConfig from "next/config";
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const connectDb = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }
  // Using new database connection
  await mongoose.connect(serverRuntimeConfig.MONGO_DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  await import("../models/card");
  return handler(req, res);
};

export default connectDb;
