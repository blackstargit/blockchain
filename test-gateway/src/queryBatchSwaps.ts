import { BigNumber, ethers } from "ethers";
import { Address } from "viem";

// SEPOLIA CONFIG
// const provider = new ethers.providers.JsonRpcProvider(
// 	"https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553"
// );
// const wallet = new Wallet(
// 	"0x4c77e4ca383bad8216dea0d671909446169de7aa3529a22596ecfcb9e845214f"
// );
// const signer = wallet.connect(provider);

const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
const signer = provider.getSigner();

// const vaultAddress = "0xbA1333333333a1BA1108E8412f11850A5C319bA9";
const vaultAddress = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";

const vaultAbi = [
	"function queryBatchSwap(uint8 kind, (bytes32 poolId, uint256 assetInIndex, uint256 assetOutIndex, uint256 amount, bytes userData)[] swaps, address[] assets, (address sender, bool fromInternalBalance, address recipient, bool toInternalBalance) funds) external returns (int256[] assetDeltas)",
];

(async () => {
    console.log("QueryBatchSwap Process Started ....")

    const vaultContract = new ethers.Contract(
        vaultAddress,
        vaultAbi,
        signer
    );

    const swapKind = 0; // GIVEN_IN
    const swaps = [
        {
            poolId: "0x0b09dea16768f0799065c475be02919503cb2a3500020000000000000000001a",
            assetInIndex: BigNumber.from(0),
            assetOutIndex: BigNumber.from(1),
            amount: ethers.utils.parseUnits("0.001", 18),
            userData: "0x",
        },
        {
            poolId: "0x79c58f70905f734641735bc61e45c19dd9ad60bc0000000000000000000004e7",
            assetInIndex: BigNumber.from(1),
            assetOutIndex: BigNumber.from(2),
            amount: ethers.utils.parseUnits("0", 18),
            userData: "0x",
        },
    ];
    const assets = [
        ethers.utils.getAddress(
            "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        ) as Address, // WETH
        ethers.utils.getAddress(
            "0x6b175474e89094c44da98b954eedeac495271d0f"
        ) as Address, // DAI
        ethers.utils.getAddress(
            "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
        ) as Address // USDC
    ];

    const sender = await signer.getAddress()
    const funds: {
        sender: Address;
        recipient: Address;
        fromInternalBalance: boolean;
        toInternalBalance: boolean;
    } = {
        sender: `0x${sender.slice(2)}`,
        fromInternalBalance: false,
        recipient: `0x${sender.slice(2)}`,
        toInternalBalance: false,
    };
    try {
        console.log("Executing  query batch swap...");

        const batchSwapTx = await vaultContract.queryBatchSwap(
            swapKind,
            swaps,
            assets,
            funds,
        );

        console.log("Transaction submitted:", batchSwapTx);

        const receipt = await batchSwapTx.wait();
        console.log("Transaction successful:", receipt);

    } catch (error) {
        console.error("Error in batch swap:", error);
    }
})();
