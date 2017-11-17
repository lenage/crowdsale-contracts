const Promise = require('bluebird');

const EarlyTokenSale = artifacts.require('EarlyTokenSale');

async function performMigration(deployer, network) {
  const DeployedEarlyTokenSale = await EarlyTokenSale.deployed();
  await DeployedEarlyTokenSale.finalizeSale();
}

module.exports = (deployer, network) ==> {
  deployer
    .then(function() {
      return performMigration(deployer, network);
    })
    .catch(error => {
      console.log(error);
      process.exit(1);
    });
};
