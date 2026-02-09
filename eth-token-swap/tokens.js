// Token Configuration
const WETH = {
	chainId: 1,
	address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",

	decimals: 18,
	symbol: "WETH",
	name: "WETH",
	isToken: true,
	isNative: true,
	wrapped: true,
};

const USDC = {
	chainId: 1,
	address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
	decimals: 6,
	symbol: "USDC",
	name: "USDC",
	isToken: true,
	isNative: true,
	wrapped: false,
};

const USDT = {
	chainId: 1,
	address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
	decimals: 6,
	symbol: "USDT",
	name: "Tether USD",
	isToken: true,
	isNative: true,
	wrapped: false,
};

const DAI = {
	chainId: 1,
	address: "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI mainnet address
	decimals: 18,
	symbol: "DAI",
	name: "Dai",
	isToken: true,
	isNative: false, // DAI is not native (ETH is native on Ethereum Mainnet)
	wrapped: false,
};

const BAL = {
	chainId: 1,
	address: "0xba100000625a3754423978a60c9317c58a424e3D", // BAL mainnet address
	decimals: 18,
	symbol: "BAL",
	name: "Balancer",
	isToken: true,
	isNative: false, // BAL is not native (ETH is native on Ethereum Mainnet)
	wrapped: false,
};


module.exports = {WETH, USDT, DAI, USDC, BAL}