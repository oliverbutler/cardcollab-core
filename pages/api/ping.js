import getConfig from "next/config";

const config = getConfig();

export default function pong(req, res) {
  res.send("pong");
}
