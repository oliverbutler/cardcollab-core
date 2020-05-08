import { initAuth0 } from "@auth0/nextjs-auth0";
import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

export default initAuth0({
  clientId: serverRuntimeConfig.AUTH0_CLIENT_ID,
  clientSecret: serverRuntimeConfig.AUTH0_CLIENT_SECRET,
  scope: serverRuntimeConfig.AUTH0_SCOPE,
  domain: serverRuntimeConfig.AUTH0_DOMAIN,
  redirectUri: serverRuntimeConfig.REDIRECT_URI,
  postLogoutRedirectUri: serverRuntimeConfig.POST_LOGOUT_REDIRECT_URI,
  session: {
    cookieSecret: serverRuntimeConfig.SESSION_COOKIE_SECRET,
    cookieLifetime: serverRuntimeConfig.SESSION_COOKIE_LIFETIME,
  },
});
