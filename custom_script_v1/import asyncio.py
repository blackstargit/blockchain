import asyncio

from hummingbot.client.settings import GatewayConnectionSetting
from hummingbot.core.event.events import TradeType
from hummingbot.core.utils.async_utils import safe_ensure_future
from hummingbot.strategy.script_strategy_base import Decimal, ScriptStrategyBase
from balancer.get_token_rate import calculate_token_rate
from hummingbot.core.gateway.gateway_http_client import GatewayHttpClient

# amount needs to be adjusted
class GSUTradingBot(ScriptStrategyBase):
    """
    This example shows how to call the /amm/trade Gateway endpoint to execute a swap transaction
    """

    # swap params
    connector_chain_network = "balancer_ethereum_mainnet"
    trading_pair = {"WETH-DAI"}
    side = "SELL"
    order_amount = Decimal("0.01")
    slippage_buffer = 0.01
    markets = {connector_chain_network: trading_pair}
    on_going_task = False

    def __init__(self):
        super().__init__()
        self.minimum_profit = Decimal("0.01")  # Minimum profit threshold
        self.api_price = None  # API rate price feed
        self.dex_price = None  # DEX spot price
        self.dex_fee = Decimal("0.003")  # Example DEX LP fee (adjust as per exchange)
        self.trading_pair = "wstETH-AAVE"

    async def on_tick(self):
        """
        This function is called repeatedly every tick (e.g., 1 second).
        """
        try:
            # Step 1: Fetch Rates API
            self.api_price = await self.fetch_gsu_rate()

            # Step 2: Compute DEX Spot Price
            self.dex_price = await self.fetch_dex_price()

            # Step 3: Price Deviation Check
            deviation = (self.dex_price - self.api_price) / self.api_price
            self.log(f"Price Deviation: {deviation * 100:.2f}%")

            if abs(deviation) > self.minimum_profit:  # condition1
                if deviation > 0:
                    # If DEX price is higher than API, sell
                    await self.create_sell_order()
                else:
                    # If DEX price is lower than API, buy
                    await self.create_buy_order()

        except Exception as e:
            self.log(f"Error: {e}")

    # fetch and print balance of base and quote tokens
    async def get_balance(self, chain, network, address, base, quote):
        self.logger().info(f"POST /network/balance [ address: {address}, base: {base}, quote: {quote} ]")
        balanceData = await GatewayHttpClient.get_instance().get_balances(chain, network, address, [base, quote])
        self.logger().info(f"Balances for {address}: {balanceData['balances']}")

    # continuously poll for transaction until confirmed
    async def poll_transaction(self, chain, network, txHash):
        pending: bool = True
        while pending is True:
            self.logger().info(f"POST /network/poll [ txHash: {txHash} ]")
            pollData = await GatewayHttpClient.get_instance().get_transaction_status(chain, network, txHash)
            transaction_status = pollData.get("txStatus")
            if transaction_status == 1:
                self.logger().info(f"Trade with transaction hash {txHash} has been executed successfully.")
                pending = False
            elif transaction_status in [-1, 0, 2]:
                self.logger().info(f"Trade is pending confirmation, Transaction hash: {txHash}")
                await asyncio.sleep(2)
            else:
                self.logger().info(f"Unknown txStatus: {transaction_status}")
                self.logger().info(f"{pollData}")
                pending = False

    def cancel_all_orders(self):
        for order in self.get_active_orders(connector_name=self.config.exchange):
            self.cancel(self.config.exchange, order.trading_pair, order.client_order_id)

    async def fetch_gsu_rate(self):
        """
        Fetch GSU rate from external API.
        Replace `api_url` with the actual endpoint for the GSU rate feed.
        """

        token_rate = calculate_token_rate()
        return token_rate

    async def fetch_dex_price(self) -> Decimal:
        """
        Fetch the current DEX spot price based on the mid-price (average of best bid and ask prices).
        """
        try:
            # Get the connector for the specified DEX exchange
            dex_connector = self.connectors.get(self.config.exchange)

            if dex_connector is None:
                raise ValueError(f"No connector found for exchange: {self.config.exchange}")

            # Fetch the order book for the trading pair
            reserves = await dex_connector.get_pool_reserves(self.trading_pair)

            # Extract base and quote reserves
            base_reserve = Decimal(reserves["base"])
            quote_reserve = Decimal(reserves["quote"])

            if base_reserve == 0 or quote_reserve == 0:
                raise ValueError(
                    f"Pool reserves for {self.trading_pair} are invalid (base: {base_reserve}, quote: {quote_reserve})."
                )

            # Calculate spot price (quote per base, e.g., USDT per GSU)
            spot_price = quote_reserve / base_reserve

            self.log(f"DEX Spot Price for {self.trading_pair}: {spot_price}")
            return spot_price

        except IndexError:
            raise ValueError("Order book for the trading pair is empty. Cannot calculate DEX price.")
        except Exception as e:
            self.log(f"Error fetching DEX price: {e}")
            raise

    async def create_sell_order(self):
        """
        Create a sell order with price adjustments for DEX LP fee.
        """
        adjusted_price = self.dex_price * (1 - self.dex_fee)
        self.log(f"Creating Sell Order at Adjusted Price: {adjusted_price}")
        # await self.place_limit_order("sell", "GSU-USDT", Decimal("1"), adjusted_price)
        await self.sell(
            connector_name=self.config.exchange,
            trading_pair=self.trading_pair,
            amount=Decimal("1"),  # Adjust amount as needed
            price=adjusted_price,
        )

    async def create_buy_order(self):
        """
        Create a buy order with price adjustments for DEX LP fee.
        """
        adjusted_price = self.dex_price * (1 + self.dex_fee)
        self.log(f"Creating Buy Order at Adjusted Price: {adjusted_price}")
        # await self.place_limit_order("buy", "GSU-USDT", Decimal("1"), adjusted_price)
        await self.buy(
            connector_name=self.config.exchange,
            trading_pair=self.trading_pair,
            amount=Decimal("1"),  # Adjust amount as needed
            price=adjusted_price,
        )


# option 1: using time
#  def __init__(self, connectors: list, config: ClientConfigAdapter = None):
#         super().__init__(connectors, config)
#         self.last_task_time = 0
#         self.task_cooldown = 10  # Seconds between task executions
#         self.api_price = 0  # initialize to zero and fetch in on_tick
#         self.dex_price = 0  # initialize to zero and fetch in on_tick

#     def on_tick(self):
#         current_time = self.current_timestamp
#         if current_time - self.last_task_time >= self.task_cooldown:
#             # Update the api_price before calling the async_task method
#             self.update_api_price()
#             safe_ensure_future(self.arbitrage_task())
#             self.last_task_time = current_time

            