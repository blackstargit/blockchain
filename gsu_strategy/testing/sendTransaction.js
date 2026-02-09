const { ethers } = require("ethers");

WEB3_PROVIDER_URL =
	"https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553";
PRIVATE_KEY =
	"0x4c77e4ca383bad8216dea0d671909446169de7aa3529a22596ecfcb9e845214f";

// Set up provider (Infura, Alchemy, or local node)
const provider = new ethers.JsonRpcProvider(WEB3_PROVIDER_URL);

// Load wallet (ensure the private key is stored securely)
const wallet = new ethers.Wallet(PRIVATE_KEY,  provider);

async function sendTransaction() {
	// Get current nonce for the wallet
	const nonce = await provider.getTransactionCount(wallet.address);

	// Define transaction
	const tx = {
		to: "0xba12222222228d8ba445958a75a0704d566bf2c8",
		data: "0x52bbbe2900000000000000000000000000000000000000000000000000000000000000e00000000000000000000000001caf820bcb6cefc9decad36f11faf4024a9bcf0b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000001caf820bcb6cefc9decad36f11faf4024a9bcf0b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005b8da550000000000000000000000000000000000000000000000000000000067a1d24f00eba51a44c235bf4f0d3575d6c99d3d4236f69400000000000000000000018200000000000000000000000000000000000000000000000000000000000000000000000000000000000000006da08364fbeee5a2ee8e596f3db6170b147cad200000000000000000000000009d6664ad3bbef76a2a0df759dadbf29d8c8d54e2000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000",
		value: 0,
		gasLimit: "3000000",
		nonce: nonce,
	};

	console.log(`Broadcasting transaction: ${JSON.stringify(tx)}, wallet.address: ${wallet.address}`);

	// Send transaction
	const txResponse = await wallet.sendTransaction(tx);
	console.log(`Transaction sent! Hash: ${txResponse.hash}`);

	// Wait for confirmation (optional)
	const receipt = await txResponse.wait();
	console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
}

sendTransaction().catch(console.error);
