const {Web3} = require("web3");
const Contract = require("@truffle/contract");
const SimpleBalancer = require("./build/contracts/SimpleBalancer.json");
const TokenA = require("./build/contracts/TokenA.json");
const TokenB = require("./build/contracts/TokenB.json");

const web3 = new Web3("http://127.0.0.1:7545"); // Ganache local blockchain
const account = "0x247F94241a03873e060e0AF0767C21f3F2270fF5"; // Replace with your account address

const run = async () => {
	console.log("Running...");

	// Create contract abstractions from the JSON artifacts
	const tokenA = Contract(TokenA);
	tokenA.setProvider(web3.currentProvider);

	console.log("Token A contract acquired");

	const tokenB = Contract(TokenB);
	tokenB.setProvider(web3.currentProvider);

	console.log("Token B contract acquired");

	const simpleBalancer = Contract(SimpleBalancer);
	simpleBalancer.setProvider(web3.currentProvider);

	console.log("Balancer contract acquired");

	// Interact with deployed contracts
	const tokenAInstance = await tokenA.deployed();
	const tokenBInstance = await tokenB.deployed();
	const balancerInstance = await simpleBalancer.deployed();

	const amount = web3.utils.toWei("100", "ether");

	// Approve SimpleBalancer to spend your TokenA
	await tokenAInstance.approve(balancerInstance.address, amount, {
		from: account,
	});

	// Swap 100 TokenA for 100 TokenB
	console.log("Swapping 100 TokenA for 100 TokenB...");
	await balancerInstance.swapAToB(amount, { from: account });

	const tokenBBalance = await tokenBInstance.balanceOf(account);
	console.log(
		"TokenB balance after swap:",
		web3.utils.fromWei(tokenBBalance, "ether")
	);
};

run().catch(console.error);


// web3.eth
// 	.getAccounts()
// 	.then((accounts) => console.log(accounts))
// 	.catch((error) => console.error(error));