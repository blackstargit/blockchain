const { ethers } = require("hardhat");

async function main() {
	const provider = new ethers.JsonRpcProvider(
		"http://127.0.0.1:8545"
	); // Anvil RPC URL

    // Token details
    // 0x9d6664ad3bbef76a2a0df759dadbf29d8c8d54e2
	const tokenAddress = "0x6DA08364fbEEe5A2ee8E596F3Db6170B147Cad20"; // Replace with your token address
	const account =
		"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Replace with your desired account
	const balanceToSet = ethers.parseUnits("1000", 2); // Set 1000 USDC (6 decimals)

	// Get the slot where the balance is stored (varies by token, often slot 0 or 1 for simple ERC-20s)
	const slot = 0; // Replace with the correct storage slot

	// Compute storage slot for the account's balance
	const storageSlot = ethers.solidityPackedKeccak256(
		["uint256", "uint256"],
		[account, slot] // keccak256(account + slot)
	);

	// Set the balance using Anvil's cheat code
	await provider.send("anvil_setStorageAt", [
		tokenAddress,
		storageSlot,
		ethers.toBeHex(balanceToSet.toString(), 32),
	]);

	console.log(
		`Balance set: ${account} now has ${ethers.formatUnits(
			balanceToSet,
			2
		)} tokens.`
	);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
