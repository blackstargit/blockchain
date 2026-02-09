import {
	createTestClient,
	http,
	parseAbi,
	parseEther,
	publicActions,
	walletActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { localhost } from "viem/chains";

/**
 * V2: All pool operations happen on Mainnet
 * V3: All pool operations happen on Sepolia (pre-launch)
 */

export const setupExampleFork = async () => {
	const rpcUrl = `http://localhost:7545`;
	const sepoliaUrl =
		"https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553";

	// const client = createClient({
	// 	chain: sepolia,
	// 	transport: http(sepoliaUrl),
	// })
	// 	.extend(publicActions)
	// 	.extend(walletActions);

	const client = createTestClient({
		mode: "ganache",
		chain: localhost,
		transport: http(rpcUrl),
	})
		.extend(publicActions)
		.extend(walletActions);

	const userAccount = (await client.getAddresses())[0];
	// const userAccount = privateKeyToAccount(
	// 	"0x4c77e4ca383bad8216dea0d671909446169de7aa3529a22596ecfcb9e845214f"
	// );

	// Wrap ETH into WETH for default anvil account #0
	const { request } = await client.simulateContract({
		account: userAccount,
		address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
		abi: parseAbi(["function deposit() payable"]),
		functionName: "deposit",
		args: [],
		value: parseEther("0.01"),
	});

	await client.writeContract(request);

	// TODO: swap wETH for BAL to prepare for add liquidity example
	// TODO: add liquidity to a pool to prepare for remove liquidity example
	const res = { client, rpcUrl, userAccount };
	return res;
};

// (async () => await setupExampleFork())();
