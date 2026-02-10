import React, { useEffect, useState } from "react";
import Web3 from "web3";

function App() {
	const [web3, setWeb3] = useState(null);
	const [account, setAccount] = useState(null);
	const [contract, setContract] = useState(null);

	useEffect(() => {
		const initWeb3 = async () => {
			if (window.ethereum) {
				const web3Instance = new Web3(
					window.ethereum
				);
				setWeb3(web3Instance);

				const accounts =
					await window.ethereum.request(
						{
							method: "eth_requestAccounts",
						}
					);
				setAccount(accounts[0]);

				// Replace with your contract ABI and address
				const contractABI = [...""];
				const contractAddress =
					"0xYourContractAddressHere";
				const contractInstance =
					new web3Instance.eth.Contract(
						contractABI,
						contractAddress
					);
				setContract(contractInstance);
			} else {
				console.error(
					"MetaMask not detected. Please install MetaMask."
				);
			}
		};

		initWeb3();
	}, []);

	const callSwap = async () => {
		if (contract) {
			try {
				const response = await contract.methods
					.swap(
						"0xTokenIn",
						"0xTokenOut",
						1000
					)
					.send({ from: account });
				console.log("Swap response:", response);
			} catch (error) {
				console.error(
					"Error calling swap:",
					error
				);
			}
		}
	};

	return (
		<div className="h-screen flex flex-col items-center p-4">
			<h1 className="text-6xl text-gray-600">
				Balancer-like DEX
			</h1>
			<div className="flex flex-col justify-center items-center h-full">
				{account ? (
					<div className="text-center">
						<p className="text-green-800 text-4xl pt-4">
							Connected
							account:
						</p>
						<p>{account}</p>
					</div>
				) : (
					<p className="text-green-800 text-4xl pt-4">
						No Account is
						Connected
					</p>
				)}

				<button
					onClick={callSwap}
					className="border-solid border-black bg-gray-700 text-white text-2xl p-3 rounded-lg mt-4 hover:text-black hover:bg-gray-400 hover:p-3.5 "
				>
					Swap Tokens
				</button>
			</div>
		</div>
	);
}

export default App;
