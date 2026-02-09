const { BalancerSDK } = require("@balancer-labs/sdk");

const balancer = new BalancerSDK({
	network: this._chain.chainId,
	rpcUrl: this._chain.rpcUrl,
});

balancer.swaps.