export const awsConfig = {
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: "eu-west-2:40d8c414-ec1d-478a-8939-f617cfa4e5e2",

    // REQUIRED - Amazon Cognito Region
    region: "eu-west-2",

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    identityPoolRegion: "eu-west-2",

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "eu-west-2_3huFl1baT",

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "7sph4fei4hohkvpe227lqdnstc",

    // OPTIONAL - Hosted UI configuration
    oauth: {
      domain: "cardcollab.auth.eu-west-2.amazoncognito.com",
      scope: ["email", "profile", "openid"],
      redirectSignIn: "http://localhost:3000/",
      redirectSignOut: "http://localhost:3000/",
      responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
    },
  },
};
