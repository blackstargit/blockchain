async function createpublicWalletClient(rpcUrl: string) {
	// const PRIVATE_KEY =
	//   '0xeafd00d1ac9de9d38dba7ab5aef973f068d610aeabdb4880fcd2b77084c178da'; // **Handle with extreme care!**

	const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

	const account = privateKeyToAccount(
		`0x${wallet.privateKey.slice(2)}`
	);

	// // Public Client (for read-only operations)
	// const publicClient = createPublicClient({
	//   chain: localhost,
	//   transport: http(rpcUrl),
	// });

	// console.log(publicClient);
	// console.log('==================================');

	// // Wallet Client (for read and write operations)
	// const walletClient = createWalletClient({
	//   chain: localhost,
	//   transport: http(rpcUrl),
	//   account,
	// });

	// console.log(walletClient);
	// console.log('==================================');

	// function createPublicWalletClient(
	//   publicClient: PublicActions,
	//   walletClient: WalletClient,
	// ): PublicWalletClient {
	//   return {
	//     ...walletClient,
	//     ...Object.fromEntries(
	//       Object.entries(publicClient).filter(
	//         ([key]) => !(key in walletClient),
	//       ),
	//     ),
	//   } as PublicWalletClient;
	// }
	//
	// const client = createPublicWalletClient(publicClient, walletClient);

	const client: PublicWalletClient = createClient({
		chain: localhost,
		transport: http(rpcUrl),
	})
		.extend(publicActions)
		.extend(walletActions);

	console.log(client);
	console.log("==================================");

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
		// walletClient,
		// publicClient,
		rpcUrl,
		userAccount,
	};
}

console.log(`Survived createClient ftn`);

const approveSpenderOnToken = async (
	client: PublicWalletClient,
	account: Address,
	token: Address,
	spender: Address,
	amount = MaxUint256 // approve max by default
): Promise<boolean> => {
	let approved = await hasApprovedToken(
		client,
		account,
		token,
		spender,
		amount
	);

	if (!approved) {
		// approve token on the vault
		await client.writeContract({
			account,
			chain: client.chain,
			address: token,
			abi: erc20Abi,
			functionName: "approve",
			args: [spender, amount],
		});

		approved = await hasApprovedToken(
			client,
			account,
			token,
			spender,
			amount
		);
	}

	return approved;
};

const hasApprovedToken = async (
	client: PublicWalletClient,
	account: Address,
	token: Address,
	spender: Address,
	amount = MaxUint256
): Promise<boolean> => {
	const allowance = await client.readContract({
		address: token,
		abi: erc20Abi,
		functionName: "allowance",
		args: [account, spender],
	});

	const hasApproved = allowance >= amount;
	return hasApproved;
};

console.log(`Survived approval ftn`);

const t: BalancerTrade = <BalancerTrade>trade;
//     const tokens: TokenApi[] = await Promise.all(
//   t.swap.swapInfo.tokenAddresses.map(async (address) => {
//     const tokenInfo = this.tokenList[getAddress(address)];

//     if (tokenInfo) {
//     logger.info("Inside list")

//       return {
//         address: `0x${address.slice(2)}`,
//         decimals: tokenInfo.decimals,
//       };
//     } else {
//       logger.info(`Not in list`)
//           return {
//             address: `0x${address.slice(2)}`,
//             decimals: 18,
//           };
//         }

//   })
// );

//     const pools: Address[] = t.swap.swapInfo.swaps.map(
//       (swap) => {
//         const poolId = `0x${swap.poolId.slice(2)}`
//         return poolId.slice(0, 42) as Address
//       },
//     );

// logger.info(`Pools: ${JSON.stringify(pools, null, 2)}, Tokens: ${JSON.stringify(tokens, null, 2)}. chain: ${this._chain.chainId}. ${typeof this._chain.chainId}`)

const swapInput: SwapInput = {
	chainId: this._chain.chainId,
	paths: t.swap.paths,
	swapKind: t.swap.kind,
};

console.log("Survived swapInput:");

const swap = new Swap(swapInput);
console.log("Survived swap:");

//  IF all elese fails pass [info[0] ] as paths
// try ganache_url in docker-compose

const queryOutput = await swap.query(this.ganacheRpcUrl);
console.log("Survived queryOutput:");

const { client, userAccount } = await createpublicWalletClient(
	this.ganacheRpcUrl
);
console.log("Survived createClient:");

let tokenIn: TokenAmount;
if (queryOutput.swapKind === SwapKind.GivenIn) {
	tokenIn = queryOutput.amountIn;
} else {
	tokenIn = queryOutput.expectedAmountIn;
}
console.log("Survived tokenIn:");

// approving spender
await approveSpenderOnToken(
	client,
	userAccount,
	tokenIn.token.address,
	PERMIT2[this._chain.chainId]
);

console.log("Survived approveSpenderOnToken:");

console.log(ttl);
// const deadline = BigInt(ttl)
const deadline = BigInt(9999999999999);
const slippage = Slippage.fromPercentage(`${this.getAllowedSlippage()}`);
const buildCallParams: SwapBuildCallInput = {
	slippage: slippage,
	deadline: deadline,
	queryOutput: queryOutput,
	sender: `0x${wallet.address.slice(2)}`,
	recipient: `0x${wallet.address.slice(2)}`,
};

console.log("Survived buildCallParams:");

// logger.info(`buildCallParams: ${JSON.stringify(buildCallParams,null, 2)}`)

const swapCall = swap.buildCall(buildCallParams);

// Use signature to permit2 approve transfer of tokens to Balancer's cannonical Router
// const signedPermit2BatchParams = {
//   ...buildCallParams,
//   client: client,
//   owner: utils.getAddress(`0x${wallet.address.slice(2)}`) as Address,
// };

// console.log('Survived signedPermit2Batch:');
// console.log(signedPermit2BatchParams);

// const signedPermit2Batch = await Permit2Helper.signSwapApproval(
//   signedPermit2BatchParams,
// );

// console.log('Survived signedPermit2Batch:');

// const swapCall = swap.buildCallWithPermit2(
//   buildCallParams,
//   signedPermit2Batch,
// );

console.log("Survived swapCall:");

const hash = await client.sendTransaction({
	data: swapCall.callData,
	to: swapCall.to,
	value: swapCall.value,
});

console.log("Survived hash:");

const txReceipt = await client.waitForTransactionReceipt({ hash });

console.log("Survived txReceipt:");
console.log(txReceipt);

nonce = await client.getTransactionCount({
	address: userAccount,
});

const transaction: Transaction = {
	gasLimit: BigNumber.from(overrideParams.gasLimit),
	nonce: nonce,
	to: swapCall.to,
	data: swapCall.callData,
	value: BigNumber.from(swapCall.value),
	chainId: this._chain.chainId,
};

return transaction;
//   const broadcastParams: TransactionRequest = {
//     ...overrideParams,
//     ...txData,

//     // value: t.swap.swapInfo.swapAmount,
//     // from: txDataRaw.to,
//     // gasPrice: overrideParams.gasPrice,
//     // chainId: this._chain.chainId,
//     // type: 2,
//     // accessList: ,
//     // customData: ,

//     // ccipReadEnabled: true,
//   }
//   console.log(broadcastParams)

// //   const dummyParams = {
// //  "type": 2,
// //  "chainId": 1337,
// //  "nonce": 86,
// //  "maxPriorityFeePerGas": {
// //     "type": "BigNumber",
// //     "hex": "0x59682f00"
// //  },
// //  "maxFeePerGas": {
// //     "type": "BigNumber",
// //     "hex": "0x596a69ae"
// //  },
// //  "gasPrice": null,
// //  "gasLimit": {
// //     "type": "BigNumber",
// //     "hex": "0x5208"
// //  },
// //  "to": "0x341Bb3B0F246B3EF542bD7A867884d4Dd31a44b9",
// //  "value": {
// //     "type": "BigNumber",
// //     "hex": "0x0de0b6b3a7640000"
// //  },
// //  "data": "0x",
// //  "accessList": [],
// //  "hash": "0x6ca5ea0a76cb06fe6895fe42c0abc5aebaab3cf44cbe45101f7afecd752e51f8",
// //  "v": 0,
// //  "r": "0x0001551d0892972866e777996db946897c1a1ce68546a3add119ff9088244537",
// //  "s": "0x214607d735686ead71610b4442684e107e8a912a4de5bea6a83316b41dfef511",
// //  "from": "0x341Bb3B0F246B3EF542bD7A867884d4Dd31a44b9",
// //  "confirmations": 0
// //   }

// //   	const tx = {
// // 	to: "0x341Bb3B0F246B3EF542bD7A867884d4Dd31a44b9",
// // 	value: utils.parseEther("1.0"),
// // };

// //     const txResponse0: ContractTransaction = await EVMTxBroadcaster.getInstance(
// //     this._chain,
// //     `0x${wallet.address.slice(2)}`,
// //     ).broadcast(tx);

// //   logger.info(`txResponse0`)
// //   logger.info(`txResponse0 ${txResponse0.hash}`)

// const txResponse: ContractTransaction = await EVMTxBroadcaster.getInstance(
//   this._chain,
//   `0x${wallet.address.slice(2)}`,
// ).broadcast(broadcastPar.ams);

//   logger.info(`txResponse`)

//   logger.info(`Transaction Details: ${JSON.stringify(txResponse.hash)}`);
//   return txResponse;


//  GREAT  UPHEAVEL
    // Send the transaction
    const txResponse = await wallet.sendTransaction({
      ...txData,
      ...overrideParams,
    });

    console.log('Successful');
    console.log(txResponse);

    return txResponse;

    // // Create the transaction object
    // const txData = {
    //   to: '0xBA12222222228d8Ba445958a75a0704d566BF2C8', // Recipient address
    //   value: BigNumber.from(0), // Amount to send in Wei
    //   data: '0x945bcec9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000300000000000000000000000000341bb3b0f246b3ef542bd7a867884d4dd31a44b90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000341bb3b0f246b3ef542bd7a867884d4dd31a44b900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000380000000000000000000000000000000000000000000000000000000006766e3f50000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001000b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000079c58f70905f734641735bc61e45c19dd9ad60bc0000000000000000000004e7000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb4800000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000001bc16d674ec8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    // };