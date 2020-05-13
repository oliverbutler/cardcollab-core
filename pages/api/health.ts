import getConfig from "next/config";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const health = (req, res) => {
  const status = {
    systemTime: new Date(Date.now()).toLocaleString(),
    deployTime: serverRuntimeConfig.DEPLOY_TIME,
  };
  res.send(status);
};

export default health;
