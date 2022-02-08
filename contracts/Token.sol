// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

// Sandbox token to only be used for development and testing
contract Token is ERC20 {
    uint8 _decimals;
    
    constructor(string memory _n, string memory _s, uint8 _d) ERC20(_n, _s) {
        _decimals = _d;
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    // If a wallet sends an ETH transaction to this contract (any value),
    //  add 10,000 tokens to their account
    fallback() external {
        _mint(msg.sender, (10000 * (uint256(10) ** uint256(decimals()))));
    }
}