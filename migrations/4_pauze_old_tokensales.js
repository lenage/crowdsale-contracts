const Promise = require('bluebird');

const EarlyTokenSale = artifacts.require('EarlyTokenSale');

async function performMigration(deployer, network) {
  const oldOne = await EarlyTokenSale.at(
    '0x8A0DF1D573C8D9c64e8A4062CBA50dCE0d22cDAd'
  );
  await oldOne.pauseContribution();
}

module.exports = function(deployer, network) {
  deployer
    .then(function() {
      return performMigration(deployer, network);
    })
    .catch(error => {
      console.log(error);
      process.exit(1);
    });
};
