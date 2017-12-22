pragma solidity ^0.4.15;

import "./NMBToken.sol";

contract DataBrokerDaoToken is NMBToken {

    function DataBrokerDaoToken(address _tokenFactory) NMBToken(
      _tokenFactory,
      0x0,                    // no parent token
      0,                      // no snapshot block number from parent
      "Not My Bussiness Token", // Token name
      18,                     // Decimals
      "NMB",                 // Symbol
      true                   // Enable transfers
      )
      {}

}
