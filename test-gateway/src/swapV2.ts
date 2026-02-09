/**
 * Example showing how to use Smart Order Router (SOR) to query and execute a swap
 *
 * Run with:
 * pnpm example ./examples/swaps/swapV2.ts
 */

import {
	ChainId,
	Slippage,
	SwapBuildCallInput,
	SwapKind,
	Token,
	TokenAmount,
	VAULT,
	erc20Abi,
} from "@balancer/sdk";
import { parseEventLogs } from "viem";
import { TOKENS } from "./addresses";
import { setupExampleFork } from "./client";
import { approveSpenderOnToken } from "./helper";
import { querySmartPath } from "./querySmartPath";

const swapV2 = async () => {
	// Choose chain id to start fork
	const chainId = ChainId.MAINNET;
	const { client, rpcUrl, userAccount } = await setupExampleFork();
	console.log("Checks 1");

	// User defines these params for querying swap with SOR
	const swapKind = SwapKind.GivenIn;
	const tokenIn = new Token(
		chainId,
		TOKENS[chainId].WETH.address,
		TOKENS[chainId].WETH.decimals,
		"WETH"
	);
	const tokenOut = new Token(
		chainId,
		TOKENS[chainId].USDC.address,
		TOKENS[chainId].USDC.decimals,
		"USDC"
	);

	const swapAmount =
		swapKind === SwapKind.GivenIn
			? TokenAmount.fromHumanAmount(tokenIn, "1")
			: TokenAmount.fromHumanAmount(tokenOut, "1");

	console.log("Checks 2");

	const { swap, queryOutput } = await querySmartPath({
		rpcUrl,
		chainId,
		swapKind,
		tokenIn,
		tokenOut,
		swapAmount,
	});

	console.log("Checks 3");

	// User defines these params for sending transaction
	// const sender = userAccount.address;
	// const recipient = userAccount.address;
	const sender = userAccount;
	const recipient = userAccount;
	const slippage = Slippage.fromPercentage("0.1");
	const deadline = BigInt(9999999999999); // Infinity
	const wethIsEth = false;

	const swapBuildCallInput: SwapBuildCallInput = {
		sender,
		recipient,
		slippage,
		deadline,
		wethIsEth,
		queryOutput,
	};

	console.log("Checks 4");

	// Approve V2 Vault contract as spender of tokenIn
	await approveSpenderOnToken(
		client,
		sender,
		tokenIn.address,
		VAULT[chainId]
	);

	console.log("Checks 5");

	// Build call to make swap transaction
	const swapCall = swap.buildCall(swapBuildCallInput);

	console.log("Checks 6");

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
    
	// const hash = await client.sendTransaction({
	// 	account: userAccount,
	// 	data: swapCall.callData,
	// 	to: swapCall.to,
	// 	value: BigInt(1000000000000000000),
    // });
    
    const hash = await client.sendTransaction({
		account: userAccount,
		to: userAccount,
		value: BigInt(10000000000000000000),
    });
	console.log("Checks");

	const txReceipt = await client.getTransactionReceipt({ hash });

	const logs = parseEventLogs({
		abi: erc20Abi,
		eventName: "Transfer",
		logs: txReceipt.logs,
	});

    console.log("Swap Results:");
    console.log(txReceipt)
	console.table(
		logs.map((log, index) => ({
			Type: index === 0 ? "Token In" : "Token Out",
			Address: log.address,
			Amount: log.args.value,
		}))
	);
};
(async () => {
	await swapV2();
})();
