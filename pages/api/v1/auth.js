import connectDb from "../../../middlewares/db";
import mongoose from "mongoose";

const handler = (req, res) => {
  console.log(mongoose.connection.readyState);

  res.send(":)");
};

export default connectDb(handler);
