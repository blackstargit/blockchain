import {
	BalancerApi,
	Slippage,
	Swap,
	SwapKind,
	Token as Token$1,
	TokenAmount,
} from "@balancer/sdk";
import { BigNumber, Contract, providers, utils, Wallet } from "ethers";
import dotenv from "dotenv"

dotenv.config()
const chainId = 1;
const ganacheUrl = `http://localhost:7545`;
const infuraUrl = `https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553`;
const rpcUrl = `https://api-v3.balancer.fi/`;

const WETHToken = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const USDCToken = "0xA0b86991C6218B36c1d19D4a2e9EB0cE3606EB48";
const BALToken = "0xba100000625a3754423978a60c9317c58a424e3D";

const PRIVATE_KEY = `0xeafd00d1ac9de9d38dba7ab5aef973f068d610aeabdb4880fcd2b77084c178da`;
const WALLET_ADDRESS = "0x341Bb3B0F246B3EF542bD7A867884d4Dd31a44b9";
const VAULT_ADDRESS = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
// const poolId =
// "0x8353157092ed8be69a9df8f95af097bbf33cb2af0000000000000000000005d9";
const queryBatchSwap = [
	"function queryBatchSwap(uint8 kind, (bytes32 poolId, uint256 assetInIndex, uint256 assetOutIndex, uint256 amount, bytes userData)[], address[] assets, (address sender, bool fromInternalBalance, address recipient, bool toInternalBalance))",
];
const querySwapExactIn = [
	// Include the ABI of the 'querySwapExactIn' function
	"function querySwapExactIn(tuple(address tokenIn, tuple(address pool, address tokenOut, bool isBuffer)[] steps, uint256 exactAmountIn, uint256 minAmountOut)[], address sender, bytes userData) public returns (uint256)",
];

const provider = new providers.JsonRpcProvider(`http://localhost:7545`);
const signer = new Wallet(PRIVATE_KEY, provider);
const contract = new Contract(VAULT_ADDRESS, queryBatchSwap, signer);

const balancer = new BalancerApi(rpcUrl, chainId);
// // Initialize WETH
// const wethToken = new Token$1(
// 	1,
// 	"0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2",
// 	18
// );
// // Initialize BAL
// const balToken = new Token$1(
// 	1,
// 	"0xba100000625a3754423978a60c9317c58a424e3D",
// 	18
// );
// // Initialize USDC
// const usdcToken = new Token$1(
// 	1,
// 	"0xA0b86991C6218B36c1d19D4a2e9EB0cE3606EB48",
// 	6
// );

const checkPoolExists = async () => {
	// const state = await balancer.pools.fetchPoolState(poolId);

	const infoParams0 = {
		chainId: chainId,
		tokenIn: WETHToken,
		tokenOut: USDCToken,
		swapKind: SwapKind.GivenOut,
		swapAmount: TokenAmount.fromHumanAmount(usdcToken, `0.1`),
	};

	const infoParams$0 = {
		chainId: chainId,
		tokenIn: USDCToken,
		tokenOut: WETHToken,
		swapKind: SwapKind.GivenOut,
		swapAmount: TokenAmount.fromHumanAmount(wethToken, `0.1`),
	};

	const infoParams1 = {
		chainId: chainId,
		tokenIn: WETHToken,
		tokenOut: BALToken,
		swapKind: SwapKind.GivenOut,
		swapAmount: TokenAmount.fromHumanAmount(balToken, `0.1`),
	};

	const infoParams$1 = {
		chainId: chainId,
		tokenIn: BALToken,
		tokenOut: WETHToken,
		swapKind: SwapKind.GivenOut,
		swapAmount: TokenAmount.fromHumanAmount(wethToken, `0.1`),
	};

	const infoParams2 = {
		chainId: chainId,
		tokenIn: USDCToken,
		tokenOut: BALToken,
		swapKind: SwapKind.GivenOut,
		swapAmount: TokenAmount.fromHumanAmount(balToken, `0.1`),
	};

	const infoParams$2 = {
		chainId: chainId,
		tokenIn: BALToken,
		tokenOut: USDCToken,
		swapKind: SwapKind.GivenOut,
		swapAmount: TokenAmount.fromHumanAmount(usdcToken, `0.1`),
	};

	const info0 = await balancer.sorSwapPaths.fetchSorSwapPaths(
		infoParams0
	);
	const info$0 = await balancer.sorSwapPaths.fetchSorSwapPaths(
		infoParams$0
	);
	const info1 = await balancer.sorSwapPaths.fetchSorSwapPaths(
		infoParams1
	);
	const info$1 = await balancer.sorSwapPaths.fetchSorSwapPaths(
		infoParams$1
	);

	const info2 = await balancer.sorSwapPaths.fetchSorSwapPaths(
		infoParams2
	);

	const info$2 = await balancer.sorSwapPaths.fetchSorSwapPaths(
		infoParams$2
	);

	// const outputAmount = bestPath.outputAmountRaw;
	// const inputAmount = bestPath.inputAmountRaw;

	// const marketSp = math.divide(
	// 	math.fraction(outputAmount),
	// 	math.fraction(inputAmount)
	// );

	// const executionPrice = new Fraction(
	// 	marketSp.d.toString(),
	// 	marketSp.n.toString()
	// );

	// const result = {
	// 	trade: {
	// 		swap: {
	// 			swapInfo: info,
	// 			maxSlippage: 1,
	// 			deadline: "0", // updated before trade execution
	// 			kind: SwapKind.GivenOut,
	// 		},
	// 		executionPrice,
	// 	},
	// 	expectedAmount: CurrencyAmount.fromRawAmount(
	// 		inTokenUni,
	// 		outputAmount.toString()
	// 	),
	// };

	console.log(
		info0.length,
		"\n\n",
		info$0.length,
		"\n\n",
		info1.length,
		"\n\n",
		info$1.length,
		"\n\n",
		info2.length,
		"\n\n",
		info$2.length
	);
};

const correctSwapInfo = async () => {
	const infoParams0 = {
		chainId: chainId,
		tokenIn: WETHToken,
		tokenOut: USDCToken,
		swapKind: SwapKind.GivenOut,
		swapAmount: TokenAmount.fromHumanAmount(usdcToken, `0.1`),
	};

	const info = await balancer.sorSwapPaths.fetchSorSwapPaths(
		infoParams0
	);

	if (!info[0].inputAmountRaw) {
		throw new Error(
			"inputAmountRaw is undefined in the first path."
		);
	}

	const tokenAddresses = info[0].tokens.map((token) => token.address);

	// for entire array, and proper handle
	const swaps = info[0].pools.map((pool, index) => ({
		poolId: pool,
		assetInIndex: index, // Example logic; update based on your mapping logic
		assetOutIndex:
			index + 1 < tokenAddresses.length
				? index + 1
				: index, // Next token or the same
		amount: info[0].inputAmountRaw.toString(), // Convert bigint to string
		userData: "0x", // Placeholder, customize based on your needs
	}));

	console.log(
		"Log;",
		info[0].inputAmountRaw,
		"\n\n",
		typeof info[0].inputAmountRaw,
		BigNumber.from("100")
	);

	const swapInfo = {
		tokenAddresses: tokenAddresses, // tokens used in swaps
		swaps: swaps, // swaps calldata
		swapAmount: BigNumber.from(info[0].inputAmountRaw),
		swapAmountForSwaps: BigNumber.from(info[0].inputAmountRaw), // used for wrapped assets, eg: stETH / wstETH, CHECK
		returnAmount: BigNumber.from(info[0].outputAmountRaw), // CORRECT
		returnAmountFromSwaps: BigNumber.from(
			info[0].outputAmountRaw
		), // used for wrapped assets, eg: stETH/wstETH, CHECK
		returnAmountConsideringFees: BigNumber.from(
			info[0].outputAmountRaw
		), // CALCULATE fee logic
		// one way
		// tokenIn: tokenAddresses[0],
		// tokenInForSwaps: tokenAddresses[0], // Adjust for wrapped assets
		// tokenOut: tokenAddresses[tokenAddresses.length - 1],
		// tokenOutFromSwaps: tokenAddresses[tokenAddresses.length - 1], // Adjust for wrapped assets
		tokenIn: tokenAddresses[0],
		tokenInForSwaps: tokenAddresses[0], // Used with stETH/wstETH, CHECK
		tokenOut: tokenAddresses[tokenAddresses.length - 1],
		tokenOutFromSwaps:
			tokenAddresses[tokenAddresses.length - 1], // Used with stETH/wstETH, CHECK
		marketSp: "1", // CHECK
	};

	console.log(
		"Answer: SwapInfo\n\n",
		JSON.stringify(swapInfo, null, 3)
	);
};

const correctDecimals = async () => {
	const infoParams0 = {
		chainId: chainId,
		tokenIn: WETHToken,
		tokenOut: USDCToken,
		swapKind: SwapKind.GivenOut,
		swapAmount: TokenAmount.fromHumanAmount(usdcToken, `0.1`),
	};

	const info = await balancer.sorSwapPaths.fetchSorSwapPaths(
		infoParams0
	);

	if (!info[0].inputAmountRaw) {
		throw new Error(
			"inputAmountRaw is undefined in the first path."
		);
	}

	const paths = [
		{
			inputAmountRaw: "10000000000000000",
			outputAmountRaw: "3364540012825",
			pools: [
				"0x148ce9b50be946a96e94a4f5479b771bab9b1c59000100000000000000000054",
				"0xb6b9b165c4ac3f5233a0cf413126c72be28b468a00010000000000000000005a",
				"0x5aa90c7362ea46b3cbfbd7f01ea5ca69c98fef1c000200000000000000000020",
			],
			protocolVersion: 2,
			tokens: [
				{
					address: "0x6b175474e89094c44da98b954eedeac495271d0f",
					decimals: 18,
				},
				{
					address: "0xba100000625a3754423978a60c9317c58a424e3d",
					decimals: 18,
				},
				{
					address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
					decimals: 18,
				},
				{
					address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
					decimals: 18,
				},
			],
		},
	];

	const swapInput = {
		chainId: 1,
		paths: paths,
		swapKind: 0,
	};

	const swap = new Swap(swapInput);

	const queryOutput = await swap.query();
	console.log(queryOutput);
};

const fixSwap = async () => {
	const contractAddress = utils.getAddress(
		"0xBA12222222228d8ba445958a75a0704d566BF2C8"
	);
	const args = [
		[
			{
				tokenIn: "0x6b175474e89094c44da98b954eedeac495271d0f",
				exactAmountIn: "10000000000000000",
				steps: [
					{
						pool: "0x148ce9b50be946a96e94a4f5479b771bab9b1c59",
						tokenOut: "0xba100000625a3754423978a60c9317c58a424e3d",
						isBuffer: false,
					},
					{
						pool: "0xb6b9b165c4ac3f5233a0cf413126c72be28b468a",
						tokenOut: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
						isBuffer: false,
					},
					{
						pool: "0x5aa90c7362ea46b3cbfbd7f01ea5ca69c98fef1c",
						tokenOut: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
						isBuffer: false,
					},
				],
				minAmountOut: "0",
			},
		],
		"0x0000000000000000000000000000000000000000", // sender address
		"0x", // userData (empty bytes)
	];

	try {
		// Create a contract instance
		const contract = new Contract(
			contractAddress,
			contractAbi,
			provider
		);

		// Connect the contract to a signer (for sending transactions, if needed)
		const signer = provider.getSigner();
		const contractWithSigner = contract.connect(signer);

		// Call the querySwapExactIn function
		const result = await contractWithSigner.querySwapExactIn(
			...args
		);

		console.log("Result:", result);
	} catch (error) {
		console.error("Error:", error);
	}
};

const fixWallet = async () => {
	const provider = new providers.JsonRpcProvider(
		"http://localhost:7545"
	);
	const wallet = new Wallet(
		`0xeafd00d1ac9de9d38dba7ab5aef973f068d610aeabdb4880fcd2b77084c178da`,
		provider
	);

	const tx = {
		to: "0x341Bb3B0F246B3EF542bD7A867884d4Dd31a44b9",
		value: utils.parseEther("1.0"),
	};

	const balance = await wallet.getBalance();
	const txCount = await wallet.getTransactionCount();
	console.log(`balance: ${balance}, txCount: ${txCount}`);

	const send = await wallet.sendTransaction(tx);
	console.log(`send: ${JSON.stringify(send, null, 3)}`);
};

const fixQueryBatchSwap = async () => {
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

	const wethToken = new Token$1(chainId, WETHToken, 18);

	const swapAmount = TokenAmount.fromHumanAmount(wethToken, `10`);

	console.log(`swapAmount: ${swapAmount}`)

	const fetchSorSwapPathsParams = {
		chainId: chainId,
		tokenIn: WETHToken,
		tokenOut: BALToken,
		swapKind: swapKind,
		swapAmount: swapAmount,
	};

	const paths = await balancer.sorSwapPaths.fetchSorSwapPaths(
		fetchSorSwapPathsParams
	);

	console.log(`Survived paths ${paths.length} ${JSON.stringify(paths,null,2)}`);

	const swapParams = {
		chainId: chainId,
		paths: paths,
		swapKind: swapKind,
	};

	const swap = new Swap(swapParams);
	console.log(`Survived swap Initialize ${swap}`);

	const queryOutput = await swap.query(ganacheUrl);

	console.log(`Survived Query ${queryOutput}`);

	const deadline = BigInt(600);
	const slippage = Slippage.fromPercentage(`9`);
	const buildCallParams = {
		slippage: slippage,
		deadline: deadline,
		queryOutput: queryOutput,
		sender: `0x${signer.address.slice(2)}`,
		recipient: `0x${signer.address.slice(2)}`,
	};

	const txDataRaw = swap.buildCall(buildCallParams);

	console.log(`Survived buildCall ${txDataRaw.to} ${txDataRaw.value}`);

	const txData = {
		to: txDataRaw.to,
		data: txDataRaw.callData,
		value: txDataRaw.value,
	};

	console.log(`Survived txData`);
	console.log(txData)

	// const tx = await signer.sendTransaction({
	// 	...txData,
	// 	gasLimit: 2000000,
	// });
	// console.log(`Survived sendTransaction ${tx}`);

	// const receipt = await tx.wait();
	// console.log(`Survived receipt ${receipt}`);
};

await swap();
