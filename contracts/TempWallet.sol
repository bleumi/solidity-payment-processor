// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "openzeppelin-solidity/contracts/security/ReentrancyGuard.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract TempWallet is ReentrancyGuard {
    address payable private _merchant;
    address payable private _buyer;

    constructor(address payable merchant, address payable buyer) {
        _merchant = merchant;
        _buyer = buyer;
    }

    function settle(address token) external nonReentrant {
        IERC20 ctx = IERC20(token);
        uint256 bal = ctx.balanceOf(address(this));
        ctx.transfer(_merchant, bal);
    }

    function settleETH() external nonReentrant {
        uint256 bal = address(this).balance;
        _merchant.transfer(bal);
    }
    
    function refund(address token) external nonReentrant {
        IERC20 ctx = IERC20(token);
        uint256 bal = ctx.balanceOf(address(this));
        ctx.transfer(_buyer, bal);
    }

    function refundETH() external nonReentrant {
        uint256 bal = address(this).balance;
        _buyer.transfer(bal);
    }
    
    receive() external payable {}
}
