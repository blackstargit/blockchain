const  {ethers}  = require("ethers");

const provider = new ethers.JsonRpcProvider(
	"https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553"
);
const wallet = new ethers.Wallet(
	"4c77e4ca383bad8216dea0d671909446169de7aa3529a22596ecfcb9e845214f",
	provider
);

const tokenAddressWETH = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14"; // Replace with WETH token address
const routerAddress = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"; // Replace with Uniswap Router address
const amount =
	"115792089237316195423570985008687907853269984665640564039457584007913129639935";  // Max allowance

const tokenAbi = [
	"function approve(address spender, uint256 amount) external returns (bool)",
];

// const tokenAddressUSDC = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; // Replace with USDC token address

const tokenContractA = new ethers.Contract(tokenAddressWETH, tokenAbi, wallet);
// const tokenContractB = new ethers.Contract(tokenAddressUSDC, tokenAbi, wallet);

async function approveToken() {
	const txa = await tokenContractA.approve(routerAddress, amount);
	console.log("Transaction hash:", txa.hash);
	await txa.wait();
    console.log("Approval successful!");
    
    // const txb = await tokenContractB.approve(routerAddress, amount);
    // console.log("Transaction hash:", txb.hash);
    // await txb.wait();
    // console.log("Approval successful!");
}

approveToken().catch(console.error);
