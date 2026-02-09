from web3 import Web3

# --- Configuration ---
# Replace with your Infura/Alchemy/local node URL or similar
WEB3_PROVIDER_URL = "https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553"
PRIVATE_KEY = "0x4c77e4ca383bad8216dea0d671909446169de7aa3529a22596ecfcb9e845214f"  # Sender's private key (KEEP THIS SECRET!)
RECIPIENT_ADDRESS = "0x1caF820bCb6CEFc9deCad36f11fAF4024A9bcF0b" # Address to send Ether to

# --- Initialize Web3 ---
w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER_URL))


# --- Get Account from Private Key (Your "Wallet") ---
account = w3.eth.account.from_key(PRIVATE_KEY)
sender_address = account.address

nonce = w3.eth.get_transaction_count(sender_address)
print(f"Nonce: {nonce}")

# --- Build the Transaction ---
transaction = {
  "to": "0xba12222222228d8ba445958a75a0704d566bf2c8",
  "data": "0x52bbbe2900000000000000000000000000000000000000000000000000000000000000e00000000000000000000000001caf820bcb6cefc9decad36f11faf4024a9bcf0b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000001caf820bcb6cefc9decad36f11faf4024a9bcf0b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005b8da550000000000000000000000000000000000000000000000000000000067a1bb2a00eba51a44c235bf4f0d3575d6c99d3d4236f69400000000000000000000018200000000000000000000000000000000000000000000000000000000000000000000000000000000000000006da08364fbeee5a2ee8e596f3db6170b147cad200000000000000000000000009d6664ad3bbef76a2a0df759dadbf29d8c8d54e2000000000000000000000000000000000000000000000000000000000000271000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000000",
  "value": 0,
  "gasLimit": "3000000",
  "nonce": nonce
}


# --- Sign the Transaction (Using your "Wallet" - the account object) ---
signed_transaction = account.sign_transaction(transaction)

# --- Send the Raw Transaction ---
try:
    transaction_hash = w3.eth.send_raw_transaction(signed_transaction.rawTransaction)
    print(f"Transaction Hash: {transaction_hash.hex()}")

    # --- Wait for Transaction Receipt (Optional but Recommended) ---
    transaction_receipt = w3.eth.wait_for_transaction_receipt(transaction_hash)
    print(f"Transaction Receipt: {transaction_receipt}")

    print("Transaction successful!")

except Exception as e:
    print(f"Error sending transaction: {e}")
    print("Transaction failed.")