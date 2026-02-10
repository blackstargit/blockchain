const TokenA = artifacts.require("TokenA");
const TokenB = artifacts.require("TokenB");
const SimpleBalancer = artifacts.require("SimpleBalancer");

module.exports = async function (deployer) {
	try {
		// Deploy TokenA and TokenB
		await deployer.deploy(TokenA);
		await deployer.deploy(TokenB);
		console.log("Initial Deployment...");


		// Get instances of the deployed contracts
		const tokenA = await TokenA.deployed();
		const tokenB = await TokenB.deployed();

		// Deploy SimpleBalancer with TokenA and TokenB addresses
		await deployer.deploy(
			SimpleBalancer,
			tokenA.address,
			tokenB.address
		);

		console.log("Deployment successful!");
	} catch (error) {
		console.error("Deployment failed:", error);
	}
};
