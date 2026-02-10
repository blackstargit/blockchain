// migrations/2_deploy_contracts.js (Truffle)
const BalancerPool = artifacts.require("BalancerPool");

export default function (deployer) {
	const tokens = ["0xTokenAddress1", "0xTokenAddress2"]; // Replace with actual token addresses
	const weights = [50, 50];
	deployer.deploy(BalancerPool, tokens, weights);
};
 
