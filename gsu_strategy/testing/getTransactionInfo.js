const { ethers } = require("ethers");

WEB3_PROVIDER_URL =
    "https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553";
    
const provider = new ethers.JsonRpcProvider(WEB3_PROVIDER_URL);

// Replace with your transaction hash
const txHash =
	"0x65573e5a5161bdffe8fe9825918bb4e00e2d46b9106ae5ae8ea791625ae909e6";

async function getTransactionInfo() {
	try {
		// Get transaction details
		const tx = await provider.getTransaction(txHash);
		if (!tx) {
			console.log(
				"Transaction not found. It may be pending or incorrect hash."
			);
			return;
		}

		console.log("🔹 Transaction Details:", tx);

		// Get transaction receipt (for confirmation status)
		const receipt = await provider.getTransactionReceipt(
			txHash
		);
		if (receipt) {
			console.log("✅ Transaction Receipt:", receipt);
			console.log(
				"📌 Block Number:",
				receipt.blockNumber
			);
			console.log(
				"⛽ Gas Used:",
				receipt.gasUsed.toString()
			);
			console.log(
				"🎯 Status:",
				receipt.status === 1
					? "Success ✅"
					: "Failed ❌"
			);
		} else {
			console.log("⏳ Transaction is still pending...");
		}
	} catch (error) {
		console.error("Error fetching transaction:", error);
	}
}
(async () => getTransactionInfo())();
