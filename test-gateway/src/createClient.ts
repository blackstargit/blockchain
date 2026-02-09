import {
	createPublicClient,
	createWalletClient,
	http,
	parseAbi,
	parseEther,
	PublicActions,
	WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { localhost } from "viem/chains";

// Replace with your actual values
const PRIVATE_KEY =
	"0xeafd00d1ac9de9d38dba7ab5aef973f068d610aeabdb4880fcd2b77084c178da"; // **Handle with extreme care!**

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

type PublicWalletClient = WalletClient & PublicActions;

export async function createClient(rpcUrl: string) {
	// Public Client (for read-only operations)
	const publicClient = createPublicClient({
		chain: localhost,
		transport: http(rpcUrl),
	});

	const account = privateKeyToAccount(`0x${PRIVATE_KEY.slice(2)}`);

	// Wallet Client (for read and write operations)
	const walletClient = createWalletClient({
		chain: localhost,
		transport: http(rpcUrl),
		account,
	});

	const client: PublicWalletClient = {
		...publicClient,
		...walletClient,
	};

	const userAccount = account.address;

	// Wrap ETH into WETH for the user (if needed) - Example
	// You can comment this out if you don't need to wrap ETH initially
	try {
		const { request } = await client.simulateContract({
			account: userAccount,
			address: WETH_ADDRESS,
			abi: parseAbi(["function deposit() payable"]),
			functionName: "deposit",
			args: [],
			value: parseEther("1"), // Example: Wrap 1 ETH
		});
		const wrapTxHash = await client.writeContract(request);
		console.log(
			"Wrapped ETH into WETH. Transaction Hash:",
			wrapTxHash
		);
	} catch (error) {
		console.error("Error wrapping ETH:", error);
	}

	return {
		client, // Use walletClient for sending txs
		publicClient, // Use publicClient for read-only
		rpcUrl,
		userAccount,
	};
}

(async () => {
	const { client } = await createClient(`http://localhost:7545`);

	console.log(typeof client);
	console.log(client);
})();
