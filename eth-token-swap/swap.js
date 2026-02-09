const { ethers } = require("ethers");
const FACTORY_ABI = require("./abis/factory.json");
const POOL_ABI = require("./abis/pool.json");
const QUOTER_ABI = require("./abis/quoter.json");
const SWAP_ROUTER_ABI = require("./abis/swaprouter.json");
const { logBalances } = require("./checkBalance");
const { WETH, BAL } = require("./tokens");

// Deployment Addresses
const POOL_FACTORY_CONTRACT_ADDRESS =
	"0x1F98431c8aD98523631AE4a59f267346ea31F984";
const QUOTER_CONTRACT_ADDRESS = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e";
const SWAP_ROUTER_CONTRACT_ADDRESS =
	"0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
const PRIVATE_KEY =
	"0xeafd00d1ac9de9d38dba7ab5aef973f068d610aeabdb4880fcd2b77084c178da";

// Provider, Contract & Signer Instances
const provider = new ethers.JsonRpcProvider("http://0.0.0.0:7545");

const factoryContract = new ethers.Contract(
	POOL_FACTORY_CONTRACT_ADDRESS,
	FACTORY_ABI,
	provider
);
const quoterContract = new ethers.Contract(
	QUOTER_CONTRACT_ADDRESS,
	QUOTER_ABI,
	provider
);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// async function approveToken(tokenAddress, tokenABI, amount, wallet) {
// 	try {
// 		const tokenContract = new ethers.Contract(
// 			tokenAddress,
// 			tokenABI,
// 			wallet
// 		);

// 		const approveTransaction =
// 			await tokenContract.approve.populateTransaction(
// 				SWAP_ROUTER_CONTRACT_ADDRESS,
// 				ethers.parseEther(amount.toString())
// 			);

// 		const transactionResponse = await wallet.sendTransaction(
// 			approveTransaction
// 		);
// 		console.log(`-------------------------------`);
// 		console.log(`Sending Approval Transaction...`);
// 		console.log(`-------------------------------`);
// 		console.log(
// 			`Transaction Sent: ${transactionResponse.hash}`
// 		);
// 		console.log(`-------------------------------`);
// 		const receipt = await transactionResponse.wait();
// 		console.log(
// 			`Approval Transaction Confirmed! https://etherscan.io/txn/${receipt.hash}`
// 		);
// 	} catch (error) {
// 		console.error(
// 			"An error occurred during token approval:",
// 			error
// 		);
// 		throw new Error("Token approval failed");
// 	}
// }

async function getPoolInfo(factoryContract, tokenIn, tokenOut) {
	const poolAddress = await factoryContract.getPool(
		// changed
		tokenIn.address,
		tokenOut.address,
		3000
	);
	if (!poolAddress) {
		throw new Error("Failed to get pool address");
	}
	const poolContract = new ethers.Contract(
		poolAddress,
		POOL_ABI,
		provider
	);
	const [token0, token1, fee] = await Promise.all([
		poolContract.token0(),
		poolContract.token1(),
		poolContract.fee(),
	]);
	return { poolContract, token0, token1, fee };
}

async function quoteAndLogSwap(
	tokenA,
	tokenB,
	quoterContract,
	fee,
	signer,
	amountIn
) {
	const quotedAmountOut =
		await quoterContract.quoteExactInputSingle.staticCall({
			tokenIn: tokenA.address,
			tokenOut: tokenB.address,
			fee: fee,
			recipient: signer.address,
			deadline: Math.floor(
				new Date().getTime() / 1000 + 60 * 10
			),
			amountIn: amountIn,
			sqrtPriceLimitX96: 0,
		});
	console.log(`-------------------------------`);
	console.log(
		`Token Swap will result in: ${ethers.formatUnits(
			quotedAmountOut[0].toString(),
			tokenB.decimals
		)} ${tokenB.symbol} for ${ethers.formatEther(amountIn)} ${
			tokenA.symbol
		}`
	);
	const amountOut = ethers.formatUnits(
		quotedAmountOut[0],
		tokenB.decimals
	);
	return amountOut;
}

async function prepareSwapParams(
	tokenA,
	tokenB,
	poolContract,
	signer,
	amountIn,
	amountOut
) {
	return {
		tokenIn: tokenA.address,
		tokenOut: tokenB.address,
		fee: await poolContract.fee(),
		recipient: signer.address,
		amountIn: amountIn,
		amountOutMinimum: amountOut,
		sqrtPriceLimitX96: 0,
	};
}

async function executeSwap(swapRouter, params, signer) {
	const transaction =
		await swapRouter.exactInputSingle.populateTransaction(
			params
		);
	const receipt = await signer.sendTransaction(transaction);
	console.log(`-------------------------------`);
	console.log(`Receipt: ${receipt.hash}`);
	console.log(`-------------------------------`);
}

async function main(tokenA, tokenB, swapAmount) {
	const inputAmount = swapAmount;
	const amountIn = ethers.parseUnits(inputAmount.toString(), 18);

	try {
		// FOR WRAPPING ETH
		// await signer.sendTransaction({
		// 	to: WETH.address,
		// 	value: ethers.parseUnits("9", 18),
		// });

		// console.log("ETH wrapped")

		await logBalances();

		const { poolContract, token0, token1, fee } =
			await getPoolInfo(
				factoryContract,
				tokenA,
				tokenB
			);
		console.log(`-------------------------------`);
		console.log(
			`Fetching Quote for: ${tokenA.symbol} to ${tokenB.symbol}`
		);
		console.log(`-------------------------------`);
		console.log(`Swap Amount: ${ethers.formatEther(amountIn)}`);

		const quotedAmountOut = await quoteAndLogSwap(
			tokenA,
			tokenB,
			quoterContract,
			fee,
			signer,
			amountIn
		);

		const params = await prepareSwapParams(
			tokenA,
			tokenB,
			poolContract,
			signer,
			amountIn,
			quotedAmountOut[0].toString()
		);
		const swapRouter = new ethers.Contract(
			SWAP_ROUTER_CONTRACT_ADDRESS,
			SWAP_ROUTER_ABI,
			signer
		);
		await executeSwap(swapRouter, params, signer);
		await logBalances();
	} catch (error) {
		console.error("An error occurred:", error.message);
	}
}

main(WETH, BAL, 5);
