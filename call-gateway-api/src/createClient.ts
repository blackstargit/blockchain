import {
	createPublicClient,
	createWalletClient,
	http,
	parseEther,
	parseAbi,
} from "viem";
import { mainnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

// Replace with your actual values
const PRIVATE_KEY =
	"0xeafd00d1ac9de9d38dba7ab5aef973f068d610aeabdb4880fcd2b77084c178da"; // **Handle with extreme care!**

// Mainnet addresses (replace if you need different tokens)
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

// ERC20 ABI (for interacting with WETH and DAI)
const erc20Abi = parseAbi([
	"function approve(address spender, uint256 amount) external returns (bool)",
	"function balanceOf(address account) external view returns (uint256)",
	"function transfer(address to, uint256 amount) external returns (bool)",
]);

export async function setupEthMainnet() {
	const rpcUrl = `http://localhost:7545`;

	// Public Client (for read-only operations)
	const publicClient = createPublicClient({
		chain: mainnet,
		transport: http(rpcUrl),
	});

	const account = privateKeyToAccount(`0x${PRIVATE_KEY.slice(2)}`);

	// Wallet Client (for read and write operations)
	const walletClient = createWalletClient({
		chain: mainnet,
		transport: http(rpcUrl),
		account,
	});

	const userAccount = account.address;

	// Wrap ETH into WETH for the user (if needed) - Example
	// You can comment this out if you don't need to wrap ETH initially
	try {
		const { request } = await publicClient.simulateContract({
			account: userAccount,
			address: WETH_ADDRESS,
			abi: parseAbi(["function deposit() payable"]),
			functionName: "deposit",
			args: [],
			value: parseEther("1"), // Example: Wrap 1 ETH
		});
		const wrapTxHash = await walletClient.writeContract(
			request
		);
		console.log(
			"Wrapped ETH into WETH. Transaction Hash:",
			wrapTxHash
		);
	} catch (error) {
		console.error("Error wrapping ETH:", error);
	}

	return {
		client: walletClient, // Use walletClient for sending txs
		publicClient, // Use publicClient for read-only
		rpcUrl,
		userAccount,
	};
}

// async function mintTokens(
// 	tokenAddress: string,
// 	to: string,
// 	amount: bigint,
// 	walletClient: any,
// 	publicClient: any
// ) {
// 	const txHash = await walletClient.writeContract({
// 		address: tokenAddress,
// 		abi: erc20Abi,
// 		functionName: "transfer",
// 		args: [to, amount],
// 	});

// 	console.log(
// 		`Minted ${amount} of token ${tokenAddress} to ${to}. Tx Hash: ${txHash}`
// 	);
// 	await publicClient.waitForTransactionReceipt({ hash: txHash });
// }

async function setupAndRun() {
	// Deploy WETH and DAI ERC20 contracts to Ganache
	// Note: This is a placeholder. Replace with actual contract deployment code.
	// const wethAddress = await deployContract('WETH');
	// const daiAddress = await deployContract('DAI');

	// For the purpose of this example, we assume WETH and DAI are already deployed at the specified addresses.
	// We will mint some tokens for testing instead of deploying new contracts.
	// In a real scenario, you would deploy contracts and use their addresses.

	const { client, publicClient, userAccount } = await setupEthMainnet();

	// Mint some WETH and DAI to the Ganache account for testing
    console.log(client)
    console.log(publicClient);
    console.log(userAccount);
    

	// Deploy a Balancer Vault to Ganache
	// Note: This is a placeholder. Replace with actual contract deployment code.
	// const balancerVaultAddress = await deployContract('BalancerVault');

	// Proceed with the swap operation
}

setupAndRun();
