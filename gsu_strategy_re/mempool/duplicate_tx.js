const { ethers, BigNumber} = require("ethers");

// Replace with your RPC URL and wallet private key
const provider = new ethers.JsonRpcProvider(
	"http://localhost:8545" // Anvil RPC URL
);
const wallet = new ethers.Wallet(
	"0x4c77e4ca383bad8216dea0d671909446169de7aa3529a22596ecfcb9e845214f",
	provider
);

const transactionHash =
	"0x48b59ec7d0689eed0ec6f2062227c7437b8c43ea232b5ae3bd15a3b44c6b66ba";

async function duplicateTransaction() {
	// Fetch the original transaction details
    const tx = await provider.getTransaction(transactionHash);
    console.log("TX:", tx)

	// Replicate the transaction parameters
	const duplicateTx = {
		to: tx.to,
		value: tx.value,
		data: tx.data,
		gasLimit: tx.gasLimit,
        chainId: tx.chainId,
		maxFeePerGas: tx.maxFeePerGas || undefined, // EIP-1559
		maxPriorityFeePerGas: tx.maxPriorityFeePerGas || undefined, // EIP-1559
		nonce: await provider.getTransactionCount(wallet.address), // Use the current nonce of your wallet
	};

	// console.log("Replicating transaction:", duplicateTx);

	// Sign and send the transaction using the wallet
	const txResponse = await wallet.sendTransaction(duplicateTx);

	console.log(
		"Duplicate Transaction Sent. Transaction Hash:",
		txResponse.hash
	);

	// Wait for the transaction to be mined (optional)
	const receipt = await txResponse.wait();
	console.log("Transaction mined in block:", receipt.blockNumber);
}

duplicateTransaction().catch((error) => {
	console.error("Error duplicating transaction:", error);
});