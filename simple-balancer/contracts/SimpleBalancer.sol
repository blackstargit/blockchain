// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleBalancer {
    IERC20 public tokenA;
    IERC20 public tokenB;

    constructor(IERC20 _tokenA, IERC20 _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function swapAToB(uint256 amount) public {
        require(tokenA.transferFrom(msg.sender, address(this), amount), "Transfer of Token A failed");
        require(tokenB.transfer(msg.sender, amount), "Transfer of Token B failed");
    }

    function swapBToA(uint256 amount) public {
        require(tokenB.transferFrom(msg.sender, address(this), amount), "Transfer of Token B failed");
        require(tokenA.transfer(msg.sender, amount), "Transfer of Token A failed");
    }
}
