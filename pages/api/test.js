import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export default function test(req, res) {
  res.send(serverRuntimeConfig.SESSION_COOKIE_SECRET);
}
