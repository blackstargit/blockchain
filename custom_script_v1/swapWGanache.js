import UniswapSDKCore from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json" assert { type: "json" };
import { Pool } from "@uniswap/v3-sdk";
import { ethers } from "ethers";

const { Route, Trade, Token, CurrencyAmount, Percent } = UniswapSDKCore;

// Addresses (use forked mainnet values)
const GANACHE_URL = "http://127.0.0.1:8545";
const UNISWAP_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 Router
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI Mainnet Address
const WETH_ADDRESS = "0xC02aaA39b223FE8D0a0e5C4F27eAD9083C756Cc2"; // WETH Mainnet Address
const POOL_ADDRESS = "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"; // ETH/DAI Pool Address

async function main() {
	console.log("Starting ETH-to-DAI swap process...");

	// Connect to the forked Ganache network
	const provider = new ethers.JsonRpcProvider(GANACHE_URL);
	const signer = provider.getSigner(0); // Use the first account from Ganache
	console.log("Connected to Ganache.");

	// Define tokens
	console.log("ethers.isAddress", ethers.isAddress(DAI_ADDRESS));
	const DAI = new Token(1, DAI_ADDRESS, 18, "DAI", "Dai Stablecoin");
	const WETH = new Token(1, WETH_ADDRESS.trim(), 18, "WETH", "WETH");

	console.log("Token definitions created:", { DAI, WETH });

	// Get pool state
	console.log("Fetching pool data...");
	const poolContract = new ethers.Contract(
		POOL_ADDRESS,
		IUniswapV3PoolABI,
		provider
	);
	const [fee, sqrtPriceX96, liquidity, tick] = await Promise.all([
		poolContract.fee(),
		poolContract.slot0().then((slot) => slot.sqrtPriceX96),
		poolContract.liquidity(),
		poolContract.slot0().then((slot) => slot.tick),
	]);
	console.log("Pool data fetched:", {
		fee,
		sqrtPriceX96,
		liquidity,
		tick,
	});

	// Create the pool instance
	const pool = new Pool(
		WETH,
		DAI,
		fee,
		sqrtPriceX96.toString(),
		liquidity.toString(),
		tick
	);
	console.log("Pool instance created:", pool);

	// Create a route
	console.log("Creating route...");
	const route = new Route([pool], WETH, DAI);
	console.log("Route created:", route);

	// Define the input amount (e.g., 0.1 ETH)
	const amountIn = ethers.utils.parseEther("0.1"); // 0.1 ETH in wei
	console.log(
		"Input amount defined:",
		ethers.utils.formatEther(amountIn),
		"ETH"
	);

	const trade = Trade.exactInput(
		route,
		CurrencyAmount.fromRawAmount(WETH, amountIn.toString())
	);
	console.log("Trade created:", trade);

	// Define slippage tolerance (e.g., 0.5%)
	const slippageTolerance = new Percent("50", "10000");
	console.log(
		"Slippage tolerance set:",
		slippageTolerance.toSignificant(),
		"%"
	);

	// Get the minimum amount of DAI to receive
	const amountOutMin = trade
		.minimumAmountOut(slippageTolerance)
		.toRaw();
	console.log("Minimum output amount calculated:", amountOutMin, "DAI");

	// Deadline for the transaction (current time + 5 minutes)
	const deadline = Math.floor(Date.now() / 1000) + 300;
	console.log(
		"Transaction deadline set:",
		new Date(deadline * 1000).toLocaleString()
	);

	// Build the swap transaction
	console.log("Building swap parameters...");
	const swapParams = {
		path: trade.route.path.map((token) => token.address),
		recipient: await signer.getAddress(),
		deadline,
		amountIn: amountIn.toString(),
		amountOutMinimum: amountOutMin,
	};
	console.log("Swap parameters:", swapParams);

	const router = new ethers.Contract(
		UNISWAP_ROUTER_ADDRESS,
		[
			"function exactInputSingle((address,address,uint24,address,uint256,uint256,uint160)) external payable returns (uint256)",
		],
		signer
	);

	// Execute the swap
	console.log("Executing the swap...");
	const tx = await router.exactInputSingle(
		{
			tokenIn: WETH.address,
			tokenOut: DAI.address,
			fee: fee,
			recipient: swapParams.recipient,
			deadline: swapParams.deadline,
			amountIn: swapParams.amountIn,
			amountOutMinimum: swapParams.amountOutMinimum,
			sqrtPriceLimitX96: 0, // No price limit
		},
		{ value: amountIn } // Attach ETH as value
	);
	console.log("Transaction submitted:", tx.hash);

	const receipt = await tx.wait();
	console.log("Transaction mined:", receipt.transactionHash);
	console.log("Swap completed!");
}

main().catch((error) => {
	console.error("Error during swap process:", error);
	process.exit(1);
});
