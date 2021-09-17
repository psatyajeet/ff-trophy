// migrations/2_deploy.js
const Trophy = artifacts.require("Trophy");

module.exports = async function (deployer) {
  await deployer.deploy(Trophy);
};
