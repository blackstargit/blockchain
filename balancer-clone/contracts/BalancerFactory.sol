// contracts/BalancerFactory.sol
pragma solidity ^0.8.0;

import "./BalancerPool.sol";

contract BalancerFactory {
    mapping(address => address[]) public userPools;

    function createPool(address[] memory tokens, uint[] memory weights) external returns (address) {
        require(tokens.length == weights.length, "Mismatched arrays");
        address newPool = address(new BalancerPool(tokens, weights));
        userPools[msg.sender].push(newPool);
        return newPool;
    }
}
 