import {
	BalancerSDK,
	Network,
	Slippage,
	SwapKind,
	PERMIT2,
	TokenAmount,
	ChainId,
	Permit2Helper,
	SwapBuildCallInput,
	Address,
} from "@balancer/sdk";
import {
	parseUnits,
	parseEventLogs,
	createPublicClient,
	http,
	createWalletClient,
	custom,
	encodeFunctionData,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { erc20Abi } from "viem";
import dotenv from "dotenv"

dotenv.config()

// Constants
const CHAIN_ID = 1;
const BAL_ADDRESS: Address = `0x${process.env.BAL_TOKEN_ADDRESS!.slice(2)}`; 
const WETH_ADDRESS: Address = `0x${process.env.WETH_TOKEN_ADDRESS!.slice(2)}`; 
const amountIn = "1"; // Amount of WETH to swap
const providerRpcUrl = process.env.GANACHE_RPC_URL;
const walletPrivateKey = process.env.GANACHE_WALLET_PRIVATE_KEY as `0x${string}`;
const walletAddress = process.env.GANACHE_WALLET_ADDRESS as `0x${string}`;

const swapV3 = async () => {
	if (!providerRpcUrl) {
		throw new Error("RPC URL is not defined");
	}

	if (!walletPrivateKey) {
		throw new Error("Wallet private key is not defined");
	}

	if (!walletAddress) {
		throw new Error("Wallet address is not defined");
	}

	const publicClient = createPublicClient({
		chain:
			chainId === CHAIN_ID
				? {
						id: 1,
						name: "Mainnet",
						network: "mainnet",
						nativeCurrency: {
							decimals: 18,
							name: "Ether",
							symbol: "ETH",
						},
						rpcUrls: {
							public: {
								http: [
									providerRpcUrl,
								],
							},
							default: {
								http: [
									providerRpcUrl,
								],
							},
						},
				  }
				: undefined,
		transport: http(),
	});

	const walletClient = createWalletClient({
		chain:
			chainId === CHAIN_ID
				? {
						id: 1,
						name: "Mainnet",
						network: "mainnet",
						nativeCurrency: {
							decimals: 18,
							name: "Ether",
							symbol: "ETH",
						},
						rpcUrls: {
							public: {
								http: [
									providerRpcUrl,
								],
							},
							default: {
								http: [
									providerRpcUrl,
								],
							},
						},
				  }
				: undefined,
		account: privateKeyToAccount(walletPrivateKey),
		transport: custom(window.ethereum),
	});

	const userAccount: Address = walletAddress;

	// Configuration for Balancer SDK
	const balancer = new BalancerSDK({
		network: chainId as Network,
		rpcUrl: providerRpcUrl,
	});

	const { swaps } = balancer;

	// Query swap results before sending transaction
	const tokenInAddress = WETH_ADDRESS;
	const tokenOutAddress = BAL_ADDRESS;
	const swapKind = SwapKind.GivenIn;
	const inputAmountRaw = parseUnits(amountIn, 18); // Assuming WETH has 18 decimals

	const swap = await swaps.findRouteGivenIn({
		tokenIn: tokenInAddress,
		tokenOut: tokenOutAddress,
		amount: inputAmountRaw,
		gasPrice: await publicClient.getGasPrice(),
		maxPools: 4,
	});

	if (!swap) throw new Error("No swap route found.");

	// Create TokenAmount objects - needed for Permit2Helper and SwapBuildCallInput
	const tokenIn = {
		address: tokenInAddress,
		decimals: 18,
	};

	const tokenOut = {
		address: tokenOutAddress,
		decimals: 18,
	};
	const queryOutput = {
		swap,
		swapKind,
		tokenIn,
		tokenOut,
		amountIn: TokenAmount.fromRawAmount(
			tokenInAddress,
			swap.inputAmount.amount
		),
		amountOut: TokenAmount.fromRawAmount(
			tokenOutAddress,
			swap.outputAmount.amount
		),
		expectedAmountOut: TokenAmount.fromRawAmount(
			tokenOutAddress,
			swap.outputAmount.amount
		),
		expectedAmountIn: TokenAmount.fromRawAmount(
			tokenInAddress,
			swap.inputAmount.amount
		),
	};

	// Approve Permit2 contract as spender of tokenIn
	const tokenInApprovalData = encodeFunctionData({
		abi: erc20Abi,
		functionName: "approve",
		args: [PERMIT2[chainId], inputAmountRaw],
	});

	const tokenInApprovalTx = {
		to: tokenInAddress,
		data: tokenInApprovalData,
		value: 0n,
	};

	await walletClient.sendTransaction({
		account: userAccount,
		...tokenInApprovalTx,
	});

	// User defines the following params for sending swap transaction
	const sender = userAccount;
	const recipient = userAccount;
	const slippage = Slippage.fromPercentage("0.1"); // 0.1% slippage
	const deadline = 999999999999999999n; // Infinity

	// Using WETH directly - to avoid the wethIsEth logic
	const swapBuildCallInput: SwapBuildCallInput = {
		sender,
		recipient,
		slippage,
		deadline,
		wethIsEth: false,
		queryOutput,
	};

	// Use signature to permit2 approve transfer of tokens to Balancer's canonical Router
	const permit2Helper = new Permit2Helper(publicClient, walletClient);
	const signedPermit2Batch = await permit2Helper.signSwapApproval({
		...swapBuildCallInput,
		owner: sender,
	});

	// Build call with Permit2 signature
	const swapCall = swaps.buildSwap({
		...swapBuildCallInput,
		signedPermit2Batch,
		gasPrice: await publicClient.getGasPrice(),
	});

	if (
		"minAmountOut" in swapCall &&
		"expectedAmountOut" in queryOutput
	) {
		console.table([
			{
				Type: "Query Token Out",
				Address: queryOutput.expectedAmountOut
					.token.address,
				Expected: queryOutput.expectedAmountOut
					.amount,
				Minimum: swapCall.minAmountOut.amount,
			},
		]);
	} else if (
		"maxAmountIn" in swapCall &&
		"expectedAmountIn" in queryOutput
	) {
		console.table([
			{
				Type: "Query Token In",
				Address: queryOutput.expectedAmountIn
					.token.address,
				Expected: queryOutput.expectedAmountIn
					.amount,
				Maximum: swapCall.maxAmountIn.amount,
			},
		]);
	}

	console.log("Sending swap transaction...");

	const hash = await walletClient.sendTransaction({
		account: userAccount,
		to: swapCall.to as Address,
		data: swapCall.callData as `0x${string}`,
		value: BigInt(swapCall.value),
	});

	const txReceipt = await publicClient.waitForTransactionReceipt({
		hash,
	});

	const logs = parseEventLogs({
		abi: erc20Abi,
		eventName: "Transfer",
		logs: txReceipt.logs,
	});

	console.log("Swap Results:");
	console.table(
		logs.map((log) => ({
			Address: log.address,
			Amount: log.args.value,
		}))
	);
};

export default swapV3;
