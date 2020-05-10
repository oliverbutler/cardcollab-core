import auth0 from "../../../lib/auth0";
import getConfig from "next/config";
import fetch from "isomorphic-unfetch";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export default auth0.requireAuthentication(async function test(req, res) {
  const { user } = await auth0.getSession(req);

  fetch("https://cardcollab.eu.auth0.com/oauth/token", {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: {
      grant_type: "client_credentials",
      client_id: serverRuntimeConfig.AUTH0_CLIENT_ID,
      client_secret: serverRuntimeConfig.AUTH0_CLIENT_SECRET,
      audience: "https://cardcollab.eu.auth0.com/api/v2/",
    },
  })
    .then((response) => response.json())
    .then((response) => console.log(response));

  res.send({ user });
});
