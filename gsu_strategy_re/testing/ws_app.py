import websocket 
import json
from web3 import Web3
import time

class ws_app:
    vault_abi = [{"inputs":[{"internalType":"contract IAuthorizer","name":"authorizer","type":"address"},{"internalType":"contract IWETH","name":"weth","type":"address"},{"internalType":"uint256","name":"pauseWindowDuration","type":"uint256"},{"internalType":"uint256","name":"bufferPeriodDuration","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"contract IAuthorizer","name":"newAuthorizer","type":"address"}],"name":"AuthorizerChanged","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":True,"internalType":"address","name":"sender","type":"address"},{"indexed":False,"internalType":"address","name":"recipient","type":"address"},{"indexed":False,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ExternalBalanceTransfer","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"contract IFlashLoanRecipient","name":"recipient","type":"address"},{"indexed":True,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":False,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":False,"internalType":"uint256","name":"feeAmount","type":"uint256"}],"name":"FlashLoan","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"user","type":"address"},{"indexed":True,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":False,"internalType":"int256","name":"delta","type":"int256"}],"name":"InternalBalanceChanged","type":"event"},{"anonymous":False,"inputs":[{"indexed":False,"internalType":"bool","name":"paused","type":"bool"}],"name":"PausedStateChanged","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"bytes32","name":"poolId","type":"bytes32"},{"indexed":True,"internalType":"address","name":"liquidityProvider","type":"address"},{"indexed":False,"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"indexed":False,"internalType":"int256[]","name":"deltas","type":"int256[]"},{"indexed":False,"internalType":"uint256[]","name":"protocolFeeAmounts","type":"uint256[]"}],"name":"PoolBalanceChanged","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"bytes32","name":"poolId","type":"bytes32"},{"indexed":True,"internalType":"address","name":"assetManager","type":"address"},{"indexed":True,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":False,"internalType":"int256","name":"cashDelta","type":"int256"},{"indexed":False,"internalType":"int256","name":"managedDelta","type":"int256"}],"name":"PoolBalanceManaged","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"bytes32","name":"poolId","type":"bytes32"},{"indexed":True,"internalType":"address","name":"poolAddress","type":"address"},{"indexed":False,"internalType":"enum IVault.PoolSpecialization","name":"specialization","type":"uint8"}],"name":"PoolRegistered","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"address","name":"relayer","type":"address"},{"indexed":True,"internalType":"address","name":"sender","type":"address"},{"indexed":False,"internalType":"bool","name":"approved","type":"bool"}],"name":"RelayerApprovalChanged","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"bytes32","name":"poolId","type":"bytes32"},{"indexed":True,"internalType":"contract IERC20","name":"tokenIn","type":"address"},{"indexed":True,"internalType":"contract IERC20","name":"tokenOut","type":"address"},{"indexed":False,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":False,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"Swap","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"bytes32","name":"poolId","type":"bytes32"},{"indexed":False,"internalType":"contract IERC20[]","name":"tokens","type":"address[]"}],"name":"TokensDeregistered","type":"event"},{"anonymous":False,"inputs":[{"indexed":True,"internalType":"bytes32","name":"poolId","type":"bytes32"},{"indexed":False,"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"indexed":False,"internalType":"address[]","name":"assetManagers","type":"address[]"}],"name":"TokensRegistered","type":"event"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"contract IWETH","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"enum IVault.SwapKind","name":"kind","type":"uint8"},{"components":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"uint256","name":"assetInIndex","type":"uint256"},{"internalType":"uint256","name":"assetOutIndex","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"userData","type":"bytes"}],"internalType":"struct IVault.BatchSwapStep[]","name":"swaps","type":"tuple[]"},{"internalType":"contract IAsset[]","name":"assets","type":"address[]"},{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"bool","name":"fromInternalBalance","type":"bool"},{"internalType":"address payable","name":"recipient","type":"address"},{"internalType":"bool","name":"toInternalBalance","type":"bool"}],"internalType":"struct IVault.FundManagement","name":"funds","type":"tuple"},{"internalType":"int256[]","name":"limits","type":"int256[]"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"batchSwap","outputs":[{"internalType":"int256[]","name":"assetDeltas","type":"int256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"}],"name":"deregisterTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"address payable","name":"recipient","type":"address"},{"components":[{"internalType":"contract IAsset[]","name":"assets","type":"address[]"},{"internalType":"uint256[]","name":"minAmountsOut","type":"uint256[]"},{"internalType":"bytes","name":"userData","type":"bytes"},{"internalType":"bool","name":"toInternalBalance","type":"bool"}],"internalType":"struct IVault.ExitPoolRequest","name":"request","type":"tuple"}],"name":"exitPool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IFlashLoanRecipient","name":"recipient","type":"address"},{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"userData","type":"bytes"}],"name":"flashLoan","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"selector","type":"bytes4"}],"name":"getActionId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAuthorizer","outputs":[{"internalType":"contract IAuthorizer","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDomainSeparator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"}],"name":"getInternalBalance","outputs":[{"internalType":"uint256[]","name":"balances","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNextNonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPausedState","outputs":[{"internalType":"bool","name":"paused","type":"bool"},{"internalType":"uint256","name":"pauseWindowEndTime","type":"uint256"},{"internalType":"uint256","name":"bufferPeriodEndTime","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"}],"name":"getPool","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"enum IVault.PoolSpecialization","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"contract IERC20","name":"token","type":"address"}],"name":"getPoolTokenInfo","outputs":[{"internalType":"uint256","name":"cash","type":"uint256"},{"internalType":"uint256","name":"managed","type":"uint256"},{"internalType":"uint256","name":"lastChangeBlock","type":"uint256"},{"internalType":"address","name":"assetManager","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"}],"name":"getPoolTokens","outputs":[{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"internalType":"uint256[]","name":"balances","type":"uint256[]"},{"internalType":"uint256","name":"lastChangeBlock","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getProtocolFeesCollector","outputs":[{"internalType":"contract ProtocolFeesCollector","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"address","name":"relayer","type":"address"}],"name":"hasApprovedRelayer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"components":[{"internalType":"contract IAsset[]","name":"assets","type":"address[]"},{"internalType":"uint256[]","name":"maxAmountsIn","type":"uint256[]"},{"internalType":"bytes","name":"userData","type":"bytes"},{"internalType":"bool","name":"fromInternalBalance","type":"bool"}],"internalType":"struct IVault.JoinPoolRequest","name":"request","type":"tuple"}],"name":"joinPool","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"enum IVault.PoolBalanceOpKind","name":"kind","type":"uint8"},{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct IVault.PoolBalanceOp[]","name":"ops","type":"tuple[]"}],"name":"managePoolBalance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"enum IVault.UserBalanceOpKind","name":"kind","type":"uint8"},{"internalType":"contract IAsset","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"sender","type":"address"},{"internalType":"address payable","name":"recipient","type":"address"}],"internalType":"struct IVault.UserBalanceOp[]","name":"ops","type":"tuple[]"}],"name":"manageUserBalance","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"enum IVault.SwapKind","name":"kind","type":"uint8"},{"components":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"uint256","name":"assetInIndex","type":"uint256"},{"internalType":"uint256","name":"assetOutIndex","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"userData","type":"bytes"}],"internalType":"struct IVault.BatchSwapStep[]","name":"swaps","type":"tuple[]"},{"internalType":"contract IAsset[]","name":"assets","type":"address[]"},{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"bool","name":"fromInternalBalance","type":"bool"},{"internalType":"address payable","name":"recipient","type":"address"},{"internalType":"bool","name":"toInternalBalance","type":"bool"}],"internalType":"struct IVault.FundManagement","name":"funds","type":"tuple"}],"name":"queryBatchSwap","outputs":[{"internalType":"int256[]","name":"","type":"int256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enum IVault.PoolSpecialization","name":"specialization","type":"uint8"}],"name":"registerPool","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"contract IERC20[]","name":"tokens","type":"address[]"},{"internalType":"address[]","name":"assetManagers","type":"address[]"}],"name":"registerTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IAuthorizer","name":"newAuthorizer","type":"address"}],"name":"setAuthorizer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"paused","type":"bool"}],"name":"setPaused","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"relayer","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setRelayerApproval","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes32","name":"poolId","type":"bytes32"},{"internalType":"enum IVault.SwapKind","name":"kind","type":"uint8"},{"internalType":"contract IAsset","name":"assetIn","type":"address"},{"internalType":"contract IAsset","name":"assetOut","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"userData","type":"bytes"}],"internalType":"struct IVault.SingleSwap","name":"singleSwap","type":"tuple"},{"components":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"bool","name":"fromInternalBalance","type":"bool"},{"internalType":"address payable","name":"recipient","type":"address"},{"internalType":"bool","name":"toInternalBalance","type":"bool"}],"internalType":"struct IVault.FundManagement","name":"funds","type":"tuple"},{"internalType":"uint256","name":"limit","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swap","outputs":[{"internalType":"uint256","name":"amountCalculated","type":"uint256"}],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]
    erc20_abi = [{"constant":True,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":False,"stateMutability":"view","type":"function"}]
    pool_id = "0x00eba51a44c235bf4f0d3575d6c99d3d4236f694000000000000000000000182"
    
    def __init__(self):
        self.ALCHEMY_WS_URL = "wss://eth-sepolia.g.alchemy.com/v2/zQc9vQMfdhBuhKQAxYahhXpNMEq28QxP"
        self.ws_pending_txs = {
        "0":[],
        "1":[]
        }
        self.subscription_pending_request = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "eth_subscribe",
                "params": [
               "alchemy_pendingTransactions",
                {
                    "toAddress": ["0xBA12222222228d8Ba445958a75a0704d566BF2C8"],
                    "hashesOnly": False
                }
            ]
        }
        self.w3 = Web3(Web3.HTTPProvider("https://sepolia.infura.io/v3/c2277863d49b42909d1a6b452b4d2553"))
        self.vault_contract_address = self.w3.to_checksum_address("0xBA12222222228d8Ba445958a75a0704d566BF2C8")
        self.contract = self.w3.eth.contract(self.vault_contract_address, abi=self.vault_abi)

        
        
    def start_mined_websocket(self):
        """
        Starts the WebSocket connection.
        """
        def on_message(ws, message):
            """
            Callback for when a message is received from the WebSocket.
            """
            
            print(f"Checking for conflicting transactions {message}")
            try:
                message_json = json.loads(message)
                if 'params' in message_json and 'result' in message_json['params']:
                    transaction = message_json['params']['result']

                    # Balancer transactions have a 'data' field
                    if 'input' in transaction:
                        conflict = self.decode_input( transaction['input'], transaction['hash'])
                        print(f"Conflict is: {conflict}")
                    else:
                        print("No result in message")
                else:
                    print("No result in message")
            except json.JSONDecodeError:
                print("Error decoding JSON")      
        
        
        def on_error(ws, error):
            """
            Callback for when an error occurs.
            """
            
            print(f"Error: {error}")
        
        def on_close(ws, close_status_code, close_msg):
            """
            Callback for when the WebSocket connection is closed.
            """
            
            print("WebSocket connection closed")
        
        def on_open(ws):
            """
            Callback for when the WebSocket connection is opened.
            """
            print("WebSocket connection established")
            # Subscribe to pending transactions
            
            ws.send(json.dumps(self.subscription_pending_request))
        
        ws = websocket.WebSocketApp(
            self.ALCHEMY_WS_URL,
            on_message=on_message,
            on_error=on_error,
            on_close=on_close,
        )
        ws.on_open = on_open
        ws.run_forever()

    def decode_input(self, input_data: str, ws_tx_hash:str):
        print(f"self.ws_pending_txs: {self.ws_pending_txs}")
        
        decoded_input = self.contract.decode_function_input(input_data)
        base_asset = decoded_input[1]['singleSwap']['assetIn']
        
        
        method = str(decoded_input[0])
        method_name = method.split('(')[0]
        pool_id = None
        kind = None
        print(f"Survived decode_input (1): {decoded_input}")

        if 'swap' not in method_name:
            return False

        print(f"Survived decode_input (2):")
        

        if 'batchSwap' in method:
            # Extract the swaps array from decoded input
            swaps = decoded_input[1]['swaps']

            print(f"Survived decode_input (3):")
            
            # Iterate through all poolIds in the swaps array
            for index, swap in enumerate(swaps):
                pool_id = Web3.to_hex(swap['poolId'])
                print(f"Pool ID {index + 1}: {pool_id}")

            print(f"Survived decode_input (4):")
                
            kind = decoded_input[1]['kind']

        else:
            pool_id = Web3.to_hex(decoded_input[1]['singleSwap']['poolId'])
            kind = decoded_input[1]['singleSwap']['kind']
            start = time.time()
            token_contract = self.w3.eth.contract(base_asset, abi=self.erc20_abi)
            base_asset_name = token_contract.functions.symbol().call()
            end = time.time() - start
            
            print(f"Base Asset: {base_asset_name}, {end}")

        print('Method:', method)
        print('PoolId:', pool_id)
        print('Kind:', kind)

        if pool_id == self.pool_id: # 0 is the kind for swap
            if kind == 0:
                print("Swap kind is 0. Assigning to ws_pending_txs[0]")
                self.ws_pending_txs["0"].append(ws_tx_hash)
                return True 
            elif kind == 1:
                print("Swap kind is 1. Assigning to ws_pending_txs[1]")
                self.ws_pending_txs["1"].append(ws_tx_hash)
                return True
            else:
                print("Swap kind not recognized")
                return False
        return False
    
# ws = ws_app()
# ws.start_mined_websocket()

from web3 import Web3

# Connect to your Ethereum node provider (WebSocket provider is required for subscriptions)
# Replace with your actual WebSocket provider URL

web3 = Web3(Web3.WebsocketProvider("wss://eth-mainnet.g.alchemy.com/v2/zQc9vQMfdhBuhKQAxYahhXpNMEq28QxP"))

if web3.is_connected():
    print("Connected to Ethereum node (WebSocket)")

    def handle_pending_tx_hash(tx_hash):
        print(f"New pending transaction hash received: {tx_hash.hex()}")
        tx = web3.eth.get_transaction(tx_hash)
        if tx and 'gasPrice' in tx:
            gas_price_wei = tx['gasPrice']
            gas_price_gwei = web3.from_wei(gas_price_wei, 'gwei')
            print(f"  Transaction Hash: {tx['hash'].hex()}")
            print(f"  Gas Price (Wei): {gas_price_wei}")
            print(f"  Gas Price (Gwei): {gas_price_gwei}")
        else:
            print("  Could not retrieve full transaction details or gas price.")

    subscription = web3.eth.subscribe('newPendingTransactions', handle_pending_tx_hash)
    print("Subscribed to 'newPendingTransactions' - listening for pending transactions...")

    try:
        # Keep the script running to listen for WebSocket events
        import time
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Unsubscribing...")
        subscription.unsubscribe()
        print("Unsubscribed.")

else:
    print("Not connected to Ethereum node (WebSocket)!")

                                


