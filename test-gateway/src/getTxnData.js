const {Web3} = require("web3");

const web3 = new Web3("http://localhost:7545"); // Replace with your Ganache RPC URL

const txHash =
	"0x94cc9753893cd09094455ae25d1f100458d1fcdf180ae41ed6e6a6b814c4a643"; // Replace with your transaction hash

web3.eth
	.getTransaction(txHash)
	.then((transaction) => {
		console.log("Transaction Details:", transaction);
		return web3.eth.getTransactionReceipt(txHash);
	})
	.then((receipt) => {
		console.log("Transaction Receipt:", receipt);
	})
	.catch((error) => {
		console.error("Error:", error);
	});
