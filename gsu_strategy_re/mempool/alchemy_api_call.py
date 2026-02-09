import asyncio
import json
import websockets
import requests

pool_id = ""
balancer_vault = "0xBA12222222228d8Ba445958a75a0704d566BF2C8"
check_to_address = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
subscription_request = {
        "jsonrpc": "2.0",
        "id": 2,
        "method": "eth_subscribe",
        "params": [
            "alchemy_pendingTransactions",
            {
                "toAddress": [f"{balancer_vault}"],
                "hashesOnly": False
            }
        ]
}
uri = "wss://eth-sepolia.g.alchemy.com/v2/zQc9vQMfdhBuhKQAxYahhXpNMEq28QxP"  # Replace with your actual API key
abis = [
    {
  "name": "swap",
  "type": "function",
  "inputs": [
    {
      "name": "singleSwap",
      "type": "tuple",
      "components": [
        { "name": "poolId", "type": "bytes32" },
        { "name": "kind", "type": "uint8" },
        { "name": "assetIn", "type": "address" },
        { "name": "assetOut", "type": "address" },
        { "name": "amount", "type": "uint256" },
        { "name": "userData", "type": "bytes" }
      ]
    },
    {
      "name": "funds",
      "type": "tuple",
      "components": [
        { "name": "sender", "type": "address" },
        { "name": "fromInternalBalance", "type": "bool" },
        { "name": "recipient", "type": "address" },
        { "name": "toInternalBalance", "type": "bool" }
      ]
    },
    { "name": "limit", "type": "uint256" },
    { "name": "deadline", "type": "uint256" }
  ],
  "outputs": [{ "name": "amountCalculated", "type": "uint256" }]
},
    {
  "name": "batchSwap",
  "type": "function",
  "inputs": [
    { "name": "kind", "type": "uint8" },
    {
      "name": "swaps",
      "type": "tuple[]",
      "components": [
        { "name": "poolId", "type": "bytes32" },
        { "name": "assetInIndex", "type": "uint256" },
        { "name": "assetOutIndex", "type": "uint256" },
        { "name": "amount", "type": "uint256" },
        { "name": "userData", "type": "bytes" }
      ]
    },
    { "name": "assets", "type": "address[]" },
    {
      "name": "funds",
      "type": "tuple",
      "components": [
        { "name": "sender", "type": "address" },
        { "name": "fromInternalBalance", "type": "bool" },
        { "name": "recipient", "type": "address" },
        { "name": "toInternalBalance", "type": "bool" }
      ]
    },
    { "name": "limits", "type": "int256[]" },
    { "name": "deadline", "type": "uint256" }
  ],
  "outputs": [{ "name": "amountsCalculated", "type": "int256[]" }]
}
]


async def subscribe_to_pending_transactions():
    async with websockets.connect(uri) as websocket:
        await websocket.send(json.dumps(subscription_request))
        print(f"Sent subscription request: {subscription_request}")

        # Keep the connection open and listen for incoming messages
        async for message in websocket:
            print(f"Received message: {message}")
            try:
                message_json = json.loads(message)
                if 'params' in message_json and 'result' in message_json['params']:
                    transaction = message_json['params']['result']
                    if 'input' in transaction:
                        # should_return_no = await process_data_field(transaction['data'])
                        # if should_return_no:
                        #     print("Returning No")
                        return false
            except json.JSONDecodeError:
                print("Error decoding JSON")

            print(f"Received message: {message}")
            try:
                message_json = json.loads(message)
                if 'params' in message_json and 'result' in message_json['params']:
                    transaction = message_json['params']['result']
                    if 'input' in transaction:
                        return false
            except json.JSONDecodeError:
                print("Error decoding JSON")



# async def process_data_field(data_field):
#     """
#     Decodes the data field, checks for poolId and kind, and returns True if conditions are met, otherwise False.
#     """
#     try:
#         # Remove the '0x' prefix and decode the data
        
#         if len(data_field) < 10:
#             print('data field less than 10 characters, no function selector')
#             return False
        
#         function_selector = data_field[:10]
#         print(f'function selector: {function_selector}')
        
#         remaining_data_field = data_field[10:]

#         #Uniswap v3 swapexacttokensfortokens function selector
#         if function_selector == '0x38ed1739':
#           decoded_data = decode(['uint256', 'uint256', 'address[]', 'address'], bytes.fromhex(remaining_data_field))
#           print(f'decoded data: {decoded_data}')
#           return False

#         #Uniswap v3 multicall function selector
#         elif function_selector == '0x5ae401dc':
#           decoded_data = decode(['uint256', 'bytes[]'], bytes.fromhex(remaining_data_field))
#           print(f'decoded data: {decoded_data}')
#           deadline = decoded_data[0]
#           encoded_swaps = decoded_data[1]

#           for swap in encoded_swaps:
#             function_selector = swap[:4].hex()
#             print(f'nested function selector: {function_selector}')
#             remaining_data = swap[4:]

#             if function_selector == '38ed1739':
#                 decoded_swap_data = decode(['uint256', 'uint256', 'address[]', 'address'], remaining_data)
#                 print(f'decoded_swap_data: {decoded_swap_data}')
            
#             elif function_selector == '414bf38b':
#                 decoded_swap_data = decode(['address[]','uint256','uint256','address','uint256'], remaining_data)
#                 print(f'decoded_swap_data: {decoded_swap_data}')

#         #Uniswap v2 swapExactTokensForTokens function selector
#         elif function_selector == '0x38ed1739':
#             decoded_data = decode(['uint256', 'uint256', 'address[]', 'address'], bytes.fromhex(remaining_data_field))
#             print(f'decoded data: {decoded_data}')

#         else:
#           print('function selector not recognized')
#           return False

        
#         #THIS IS WHERE YOU WILL ADD ADDITIONAL FUNCTIONS FOR HANDLING OTHER CONTRACTS/FUNCTIONS
#         #FOLLOW THE SAME LOGIC AS ABOVE AND EXTRACT THE VALUES YOU NEED FROM THE DATA FIELD

#         #PLACEHOLDER FOR YOUR POOL ID
#         pool_id_to_check = "0xYOUR_POOL_ID_VALUE"  # Replace with the actual pool ID you're looking for

#         #THIS IS WHERE YOU WILL ACTUALLY DECODE THE DATA FIELD AND EXTRACT THE NEEDED VALUES
#         #THIS IS PSEUDOCODE
#         #decoded_data = decode_data_field(remaining_data_field) # Implement this based on ABI of contract function
#         #pool_id = extract_pool_id(decoded_data) # Implement this based on structure of decoded data
#         #kind = extract_kind(decoded_data) # Implement this based on structure of decoded data

#         # Check if the extracted values match your conditions
#         #if pool_id == pool_id_to_check and kind == 0:
#         #    return True
#         #else:
#         #    return False
#         return False

#     except Exception as e:
#         print(f"Error processing data field: {e}")
#         return False

# def extract_pool_id_and_kind(input_data: str):
#     """
#     Extract Balancer pool ID from transaction input data.
#     Returns the pool ID if found, otherwise returns None.
    
#     Args:
#         input_data (str): The input data from the transaction (hex string starting with '0x')
    
#     Returns:
#         str: Pool ID if found, None otherwise
#     """

#     # Input validation

#     if not isinstance(input_data, str):
#         return None

#     print("1")

#     # Remove '0x' if present
#     if input_data.startswith('0x'):
#         input_data = input_data[2:]
        
#     # Remove method selector (first 8 characters / 4 bytes)
#     data_without_method = input_data[8: ] 
#     print("1")
    

#     # Split into 64-byte chunks
#     chunks = [data_without_method[i:i+64] for i in range(0, len(data_without_method), 64)]
#     kind = 0

#     for chunk in chunks:
#         print(f"chunk {chunk}")
#         # Skip empty or zero-filled chunks
#         if not chunk or chunk.startswith('00'):
#             print("2")
#             continue
            
#         # 2. Should contain '0002' which is common in Balancer pool IDs
#         if '0001' not in chunk and '0002' not in chunk and '0003' not in chunk:
#             print("13")
#             continue

#         # 3. Should contain '000000000000000000000000' which represents kind =1
#         if chunk == '0000000000000000000000000000000000000000000000000000000000000001'
#             kind = 1
            
#         # 4. First few characters should be hexadecimal and non-zero
#         try:
#             first_bytes = int(chunk[:10], 16)
#             if first_bytes == 0:
#                 continue
#         except ValueError:
#             continue
            
#         # If all checks pass, return the pool ID with '0x' prefix
#         print(f"chunk 0x{chunk}")
#         if validate_pool_id_format(f"0x{chunk}"):
#             return {
#                 "pool_id": f"0x{chunk}"
#                 "kind": kind
#             }
#     return None

# def validate_pool_id_format(pool_id):
#     """
#     Validate the format of a Balancer pool ID.
#     Returns True if the pool ID is valid, otherwise False.
    
#     Args:
#         pool_id (str): The pool ID to validate
    
#     Returns:
#         bool: True if the pool ID is valid, otherwise False
#     """
#     # Input validation
#     if not isinstance(pool_id, str):
#         return False

#     # Remove '0x' if present
#     if pool_id.startswith('0x'):
#         pool_id = pool_id[2:]

#     # Check if the pool ID is a valid hexadecimal string
#     try:
#         int(pool_id, 16)
#         return True
#     except ValueError:
#         return False

# # def get_function_abi(selector_hex):
# #     """
# #     Get the function signature for a given selector hex using 4byte.directory.
# #     """

# #     if selector_hex in abis_code:
# #         index = abis_code.index(selector_hex)
# #         return abis[index]
    
# #     try:
# #         response = requests.get(f"https://www.4byte.directory/api/v1/signatures/?hex_signature={selector_hex}")
# #         data = response.json()
# #         print(data)
# #         if data["count"] > 0:
# #             abi = result["text_signature"] for result in data["results"]
            
# #             print(abi)
# #             return abi
# #         else:
# #             print(f"No matches found for selector: {selector_hex}")
# #             return []
# #     except Exception as e:
# #         print(f"Error fetching function signature: {e}")
# #         return []

# extract_pool_id('0x8bdb391341fdbea2e52790c0a1dc374f07b628741f2e062d0002000000000000000006be000000000000000000000000fc0e6a22c50b20dded90ea219c7ae8374a9900e2000000000000000000000000fc0e6a22c50b20dded90ea219c7ae8374a9900e20000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000015700b564ca08d9439c58ca5053166e8317aa1380000000000000000000000005c5b196abe0d54485975d1ec29617d42d9198326000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000001cec06d7a0c3df544100000000000000000000000000000000000000000000001511065f9803fec14700000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000032383c9152f85c2194')
# get_function_signature('0x945bcec9')

