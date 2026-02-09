import { erc20Abi } from "@balancer/sdk";
import { BigNumber, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { Address } from "viem";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
const signer = provider.getSigner();

const vaultAddress = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";

const vaultAbi = [
	"function batchSwap(uint8 kind, tuple(bytes32 poolId, uint256 assetInIndex, uint256 assetOutIndex, uint256 amount, bytes userData)[] swaps, address[] assets, tuple(address sender, bool fromInternalBalance, address recipient, bool toInternalBalance) funds, int256[] limits, uint256 deadline) payable returns (int256[] assetDeltas)",
];

(async () => {
	console.log("BatchSwap process started...");
	const address = await signer.getAddress();
	const value = String(parseEther("2"));

	const vaultContract = new ethers.Contract(
		vaultAddress,
		vaultAbi,
		signer
	);

	const wethContract = new ethers.Contract(
		"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
		erc20Abi,
		signer
	);

	const allowance = await wethContract.allowance(address, vaultAddress);
	console.log("Current allowance:", allowance.toString());

	// Approve maximum allowance if necessary
	if (allowance.lt(ethers.utils.parseUnits("1", 18))) {
		await wethContract.approve(
			vaultAddress,
			ethers.constants.MaxUint256
		);
	}

	const swapKind = 0; // GIVEN_IN

	// Define BatchSwapStep array
	const swaps = [
		{
			poolId: "0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a",
			assetInIndex: 0,
			assetOutIndex: 1,
			amount: String(parseEther("1")), // Maximum test input
			userData: "0x",
		},
		{
			poolId: "0x79c58f70905f734641735bc61e45c19dd9ad60bc0000000000000000000004e7",
			assetInIndex: 1,
			assetOutIndex: 2,
			amount: String(parseEther("1")),
			userData: "0x",
		},
	];

	// Asset addresses
	const assets = [
		ethers.utils.getAddress(
			"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
		), // WETH
		ethers.utils.getAddress(
			"0x6b175474e89094c44da98b954eedeac495271d0f"
		), // DAI
		ethers.utils.getAddress(
			"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
		), // USDC
	];

	// Fund management parameters
	const funds: {
		sender: Address;
		recipient: Address;
		fromInternalBalance: boolean;
		toInternalBalance: boolean;
	} = {
		sender: `0x${address.slice(2)}`,
		fromInternalBalance: false,
		recipient: `0x${address.slice(2)}`,
		toInternalBalance: false,
	};

	// Maximum/Minimum limits
	const limits = [value, 0, 0];

	// Deadline: 1 day from now
	const deadline = BigNumber.from(
		Math.floor(Date.now() / 1000) + 86400
	);

	try {
		console.log("Executing batch swap...");

		// Prepare transaction parameters
		const txParams = {
			gasLimit: BigNumber.from(5000000), // Adjust as needed
			gasPrice: await provider.getGasPrice(),
		};

		const batchSwapTx = await vaultContract.batchSwap(
			swapKind,
			swaps,
			assets,
			funds,
			limits,
			deadline,
			txParams
		);

		console.log("Transaction submitted:", batchSwapTx);

		const receipt = await batchSwapTx.wait();
		console.log("Transaction successful:", receipt);

		// Parse events from receipt if needed
		const assetDeltas = receipt.events?.find(
			(e: { event: string }) => e.event === "SwapResult"
		)?.args?.deltas;
		if (assetDeltas) {
			console.log(
				"Asset Deltas:",
				assetDeltas.map(
					(d: {
						toString: () => any;
					}) => d.toString()
				)
			);
		}
	} catch (error) {
		console.error("Error in batch swap:", error);
	}
})();

// const getBalance = async () => {
//     const usdc = contracts.ERC20(
// 		"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
// 		provider
//     );
//     const bal = contracts.ERC20(
// 		"0xba100000625a3754423978a60c9317c58a424e3d",
// 		provider
//     );

//     let ethBalance = await signer.getBalance();
//     let usdcBalance = await usdc.balanceOf(address);
//     let balBalance = await bal.balanceOf(address);

//     console.log(`Balances before: `);
//     console.log(`ETH: ${formatUnits(ethBalance, 18)}`);
//     console.log(`USDC: ${formatUnits(usdcBalance, 6)}`);
//     console.log(`BAL: ${formatUnits(balBalance, 18)}`);
// }
