const Promise = require('bluebird');

const MiniMeTokenFactory = artifacts.require('MiniMeTokenFactory');
const EarlyTokenSale = artifacts.require('EarlyTokenSale');
const MultiSigWalletWithDailyLimit = artifacts.require(
  'MultiSigWalletWithDailyLimit'
);
const DataBrokerDaoToken = artifacts.require('DataBrokerDaoToken');

async function performMigration(deployer, network) {
  const prevEarlyTokenSale = await EarlyTokenSale.at(
    '0x8A0DF1D573C8D9c64e8A4062CBA50dCE0d22cDAd'
  );

  // Deploy the MultiSigWallet that will collect the ether
  await deployer.deploy(
    MultiSigWalletWithDailyLimit,
    [
      '0xF55975657dd501C5F9f119fCA4956D82a6FF104A', // Kusakari
      '0x7243401654D508F997f02F5bA246e8202b2A6b2A', // Tod
      '0x8A0DF1D573C8D9c64e8A4062CBA50dCE0d22cDAd', // S
    ],
    2,
    web3.toWei(1000, 'ether')
  );

  if (network === 'mainnet') {
    // Deploy the Early Token Sale, again owned by the one deploying (Roderik)
    await deployer.deploy(
      EarlyTokenSale,
      1505746800, // 09/18/2017 @ 5:00pm (CET)
      1508166000, // 10/16/2017 @ 5:00pm (CET)
      MultiSigWalletWithDailyLimit.address,
      DataBrokerDaoToken.address
    );
  } else {
    const getBlock = Promise.promisify(web3.eth.getBlock);
    const { timestamp } = await getBlock('latest');
    // Deploy the Early Token Sale, again owned by the one deploying (Roderik)
    await deployer.deploy(
      EarlyTokenSale,
      timestamp - 3600,
      timestamp + 2592000,
      MultiSigWalletWithDailyLimit.address,
      DataBrokerDaoToken.address
    );
  }

  // Change the controller of the token to the early token sale
  prevEarlyTokenSale.changeTokenController(EarlyTokenSale.address);
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
