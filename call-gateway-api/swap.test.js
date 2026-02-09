import {
	BalancerApi,
	Slippage,
	Swap,
	SwapKind,
	Token as Token$1,
	TokenAmount,
} from "@balancer/sdk";
import dotenv from "dotenv";

dotenv.config();

// VARIABLES
const CHAIN_ID = 1;
const WETH_TOKEN_ADDRESS = process.env.WETH_TOKEN_ADDRESS;
const BAL_TOKEN_ADDRESS = process.env.BAL_TOKEN_ADDRESS;
const BALANCER_API_URL = process.env.BALANCER_API_URL;
const GANACHE_RPC_URL = process.env.GANACHE_RPC_URL;
const WALLET_ADDRESS = process.env.GANACHE_WALLET_ADDRESS;

// INITS
const balancer = new BalancerApi(BALANCER_API_URL, CHAIN_ID);
const wethToken = new Token$1(CHAIN_ID, WETH_TOKEN_ADDRESS, 18);

const queryBatchSwap = async () => {
	const kind = 0;
	const swaps = [
		{
			poolId: "0x148ce9b50be946a96e94a4f5479b771bab9b1c59000100000000000000000054",
			assetInIndex: "0",
			assetOutIndex: "1",
			amount: "100000000000000000",
			userData: "0x",
		},
		{
			poolId: "0xb6b9b165c4ac3f5233a0cf413126c72be28b468a00010000000000000000005a",
			assetInIndex: "1",
			assetOutIndex: "2",
			amount: "0",
			userData: "0x",
		},
		{
			poolId: "0x5aa90c7362ea46b3cbfbd7f01ea5ca69c98fef1c000200000000000000000020",
			assetInIndex: "2",
			assetOutIndex: "3",
			amount: "0",
			userData: "0x",
		},
	];

	const assets = [
		"0x6b175474e89094c44da98b954eedeac495271d0f",
		"0xba100000625a3754423978a60c9317c58a424e3d",
		"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
		"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
	];

	const sender = "0x0000000000000000000000000000000000000000";
	const recipient = "0x0000000000000000000000000000000000000000";
	const fromInternalBalance = false;
	const toInternalBalance = false;

	const funds = {
		sender: WALLET_ADDRESS,
		fromInternalBalance: fromInternalBalance,
		recipient: WALLET_ADDRESS,
		toInternalBalance: toInternalBalance,
	};

	console.log("Alive before");
	const result = await contract.queryBatchSwap(
		kind,
		swaps,
		assets,
		funds
	);
	console.log("Swap results (int256[]):", result);
};

const swap = async () => {
	const swapKind = SwapKind.GivenIn;
	const swapAmount = TokenAmount.fromHumanAmount(wethToken, `1`);

	// console.log(`swapAmount: ${JSON.parse(swapAmount)}`);

	const fetchSorSwapPathsParams = {
		chainId: CHAIN_ID,
		tokenIn: WETH_TOKEN_ADDRESS,
		tokenOut: BAL_TOKEN_ADDRESS,
		swapKind: swapKind,
		swapAmount: swapAmount,
	};

	console.log(`swapAmount: ${fetchSorSwapPathsParams.tokenIn}`);

	const paths = await balancer.sorSwapPaths.fetchSorSwapPaths(
		fetchSorSwapPathsParams
	);

	console.log(
		`Survived paths ${paths.length} ${JSON.stringify(
			paths,
			null,
			2
		)}`
	);

	const swapParams = {
		chainId: CHAIN_ID,
		paths: paths,
		swapKind: swapKind,
	};

	const swap = new Swap(swapParams);
	console.log(`Survived swap Initialize ${swap}`);

	const queryOutput = await swap.query(GANACHE_RPC_URL);

	console.log(`Survived Query ${queryOutput}`);

	const deadline = BigInt(600);
	const slippage = Slippage.fromPercentage(`9`);
	const buildCallParams = {
		slippage: slippage,
		deadline: deadline,
		queryOutput: queryOutput,
		sender: `0x${WALLET_ADDRESS.slice(2)}`,
		recipient: `0x${WALLET_ADDRESS.slice(2)}`,
	};

	const txDataRaw = swap.buildCall(buildCallParams);

	console.log(`Survived buildCall ${txDataRaw.to} ${txDataRaw.value}`);

	const txData = {
		to: txDataRaw.to,
		data: txDataRaw.callData,
		value: txDataRaw.value,
	};

	console.log(`Survived txData`);
	console.log(txData);

	return txData;
	// const tx = await signer.sendTransaction({
	// 	...txData,
	// 	gasLimit: 2000000,
	// });
	// console.log(`Survived sendTransaction ${tx}`);

	// const receipt = await tx.wait();
	// console.log(`Survived receipt ${receipt}`);
};

await swap();
