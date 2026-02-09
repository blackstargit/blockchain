const ethers = require("ethers");
const erc20Abi = require("./abis/erc20.json");
const wethArtifact = require("./abis/weth9.json");
const { BAL, DAI, USDC, USDT, WETH } = require("./tokens");

const provider = new ethers.JsonRpcProvider("http://localhost:7545");
const wallet = new ethers.Wallet(
	"0xeafd00d1ac9de9d38dba7ab5aef973f068d610aeabdb4880fcd2b77084c178da"
);
const signer = wallet.connect(provider);

const weth = new ethers.Contract(WETH.address, wethArtifact.abi, provider);
const usdt = new ethers.Contract(USDT.address, erc20Abi, provider);
const usdc = new ethers.Contract(USDC.address, erc20Abi, provider);
const dai = new ethers.Contract(DAI.address, erc20Abi, provider);
const bal = new ethers.Contract(BAL.address, erc20Abi, provider);

const logBalances = async () => {
	const balance = {
		ETH: await provider.getBalance(signer.address),
		WETH: await weth.balanceOf(signer.address),
		USDT: await usdt.balanceOf(signer.address),
		USDC: await usdc.balanceOf(signer.address),
		DAI: await dai.balanceOf(signer.address),
		BAL: await bal.balanceOf(signer.address),
	};

	console.log("\nADDRESS: ", wallet.address);
	console.log("--------------------");
	console.log("ETH Balance:", ethers.formatUnits(balance.ETH, 18));
	console.log("WETH Balance:", ethers.formatUnits(balance.WETH, 18));
	console.log("USDT Balance:", ethers.formatUnits(balance.USDT, 6));
	console.log("USDC Balance:", ethers.formatUnits(balance.USDC, 6));
	console.log("DAI Balance:", ethers.formatUnits(balance.DAI, 18));
	console.log("BAL Balance:", ethers.formatUnits(balance.BAL, 18));

	console.log("--------------------");
};
logBalances();
module.exports = { logBalances };
