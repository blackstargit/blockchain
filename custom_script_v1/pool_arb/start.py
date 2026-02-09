from decimal import Decimal
from typing import cast

from hummingbot.client.settings import AllConnectorSettings, ConnectorType
from hummingbot.connector.gateway.amm.gateway_evm_amm import GatewayEVMAMM
from hummingbot.connector.gateway.amm.gateway_telos_amm import GatewayTelosAMM
from hummingbot.connector.gateway.amm.gateway_tezos_amm import GatewayTezosAMM
from hummingbot.connector.gateway.common_types import Chain
from hummingbot.connector.gateway.gateway_price_shim import GatewayPriceShim
from hummingbot.core.rate_oracle.rate_oracle import RateOracle
from hummingbot.core.utils.fixed_rate_source import FixedRateSource
from hummingbot.strategy.pool_arb.pool_arb import ArbitrageBalancer  # Assuming your strategy file is named pool_arb.py
from hummingbot.strategy.pool_arb.pool_arb_config_map import pool_arb_config_map  # Assuming this is your config map
from hummingbot.strategy.market_trading_pair_tuple import MarketTradingPairTuple

print("inside start script")
def start(self):
    print("inside start method")

    connector = pool_arb_config_map.get("connector").value
    trading_pair = pool_arb_config_map.get("trading_pair").value
    order_amount = pool_arb_config_map.get("order_amount").value
    slippage_buffer = pool_arb_config_map.get("slippage_buffer").value / Decimal("100")
    minimum_profitability = pool_arb_config_map.get("minimum_profitability").value / Decimal("100")
    # task_cooldown = pool_arb_config_map.get("task_cooldown").value
    # api_price = pool_arb_config_map.get("api_price").value
    debug_price_shim = pool_arb_config_map.get("debug_price_shim").value

    # Here we are splitting the connector name which includes the chain and network into its components
    connector_split = connector.split("_")
    # connector_name = connector_split[0]
    chain = connector_split[1]
    # network = "_".join(connector_split[2:])

    # market_1 = amm_arb_config_map.get("market_1").value
    # connector_2 = amm_arb_config_map.get("connector_2").value.lower()
    # market_2 = amm_arb_config_map.get("market_2").value
    # pool_id = "_" + amm_arb_config_map.get("pool_id").value
    # order_amount = amm_arb_config_map.get("order_amount").value
    # min_profitability = amm_arb_config_map.get("min_profitability").value / Decimal("100")
    # market_1_slippage_buffer = amm_arb_config_map.get("market_1_slippage_buffer").value / Decimal("100")
    # market_2_slippage_buffer = amm_arb_config_map.get("market_2_slippage_buffer").value / Decimal("100")
    # concurrent_orders_submission = amm_arb_config_map.get("concurrent_orders_submission").value
    # debug_price_shim = amm_arb_config_map.get("debug_price_shim").value
    # gateway_transaction_cancel_interval = amm_arb_config_map.get("gateway_transaction_cancel_interval").value
    # rate_oracle_enabled = amm_arb_config_map.get("rate_oracle_enabled").value
    # quote_conversion_rate = amm_arb_config_map.get("quote_conversion_rate").value
    print("Survived before init market")

    self._initialize_markets([(connector, [trading_pair])])
    base, quote = trading_pair.split("-")

    is_connector_gateway = (
        connector in AllConnectorSettings.get_gateway_amm_connector_names()
        # or connector_name in AllConnectorSettings.get_gateway_clob_connector_names()
    )

    # treatment for only gateway
    market_info = MarketTradingPairTuple(self.markets[connector], trading_pair, base, quote)
    self.market_trading_pair_tuples = [market_info]

    if debug_price_shim:
        if is_connector_gateway:
            if Chain.ETHEREUM.chain == chain:
                gateway_connector: GatewayEVMAMM = cast(GatewayEVMAMM, market_info.market)
            elif Chain.TEZOS.chain == chain:
                gateway_connector: GatewayTezosAMM = cast(GatewayTezosAMM, market_info.market)
            elif Chain.TELOS.chain == chain:
                gateway_connector: GatewayTelosAMM = cast(GatewayTelosAMM, market_info.market)        
            else:
                raise ValueError(f"Unsupported chain: {chain}")

            GatewayPriceShim.get_instance().patch_prices(
                None,
                None,
                gateway_connector.connector_name,
                gateway_connector.chain,
                gateway_connector.network,
                trading_pair,
            )

    # what is rate oracle and fixed rate
    # changed ArbitrageBalancer params connectors=[] to

    print("Survived all init")
    self.strategy = ArbitrageBalancer()
    print("Survived all init")
    self.strategy.init_params(
        connector=connector,
        trading_pair=trading_pair,
        order_amount=order_amount,
        slippage_buffer=slippage_buffer,
        minimum_profitability=minimum_profitability,
        # task_cooldown=task_cooldown,
        # api_price=api_price,
        # debug_price_shim=debug_price_shim,
    )

    print("Survived start method")
