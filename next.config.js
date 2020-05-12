// next.config.js

var URL = "http://localhost:3000";
if (process.env.URL) URL = process.env.URL;
if (process.env.VERCEL_URL) URL = "https://cardcollab.com";

module.exports = {
  target: "serverless",
  webpack(config, options) {
    config.resolve.extensions.push(".ts", ".tsx");
    return config;
  },
  serverRuntimeConfig: {
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_SCOPE: "openid profile email",
    SESSION_COOKIE_SECRET: process.env.SESSION_COOKIE_SECRET,
    MONGO_DB: process.env.MONGO_DB,
    REDIRECT_URI: URL + "/api/auth0/callback",
    POST_LOGOUT_REDIRECT_URI: URL,
    SESSION_COOKIE_LIFETIME: 7200, // 2 hours
    SECRET: process.env.SECRET,
    MAIL_GUN_API_KEY: process.env.MAIL_GUN_API_KEY,
    DEPLOY_TIME: new Date(Date.now()).toLocaleString(),
  },
};
