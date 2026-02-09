const { ethers } = require("ethers");

// Constants
const SEPOLIA_RPC_URL =
	"https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553"; // Replace with your RPC URL
const WALLET_PRIVATE_KEY =
	"4c77e4ca383bad8216dea0d671909446169de7aa3529a22596ecfcb9e845214f"; // Replace with your wallet's private key
const DEX_ROUTER_ADDRESS = "0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3"; // Replace with DEX router address
const DAI_ADDRESS = "0xff34b3d4aee8ddcd6f9afffb6fe49bd371b8a357";
const AMOUNT_IN_ETH = ethers.parseEther("0.001")

// Provider and Wallet
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);

// ABI for Uniswap/SushiSwap Router
const ROUTER_ABI = [
	"function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) payable external returns (uint[] memory amounts)",
];

// DEX Router Contract
const router = new ethers.Contract(DEX_ROUTER_ADDRESS, ROUTER_ABI, wallet);

async function swapEthForDai() {
	try {
		const path = [ethers.ZeroAddress, DAI_ADDRESS]; // ETH -> DAI
		const amountOutMin = 0; // Set a slippage tolerance (e.g., replace with calculated minimum output)
		const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
		const to = wallet.address;

		console.log("Executing swap...");

		const tx = await router.swapExactETHForTokens(
			amountOutMin,
			path,
			to,
			deadline,
			{
				value: AMOUNT_IN_ETH, // Amount of ETH to swap
				gasLimit: 200000, // Estimate appropriate gas limit
			}
		);

		console.log("Transaction submitted: ", tx.hash);
		const receipt = await tx.wait();
		console.log(
			"Transaction confirmed in block: ",
			receipt.blockNumber
		);
	} catch (error) {
		console.error("Error during swap:", error);
	}
}

swapEthForDai();
