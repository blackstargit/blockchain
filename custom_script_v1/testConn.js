const { ethers } = require("ethers");

// Connect to Ganache
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

// Check block number
(async () => {
	const blockNumber = await provider.getBlockNumber();
	console.log("Block Number:", blockNumber);

	const balance = await provider.getBalance(
		"0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
	); // Replace with a known mainnet address
	console.log("Balance:", ethers.formatEther(balance));
})();
