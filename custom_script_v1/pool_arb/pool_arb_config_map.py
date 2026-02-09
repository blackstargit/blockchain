from decimal import Decimal

from hummingbot.client.config.config_validators import (
    validate_bool,
    validate_connector,
    validate_decimal,
    validate_market_trading_pair,
)
from hummingbot.client.config.config_var import ConfigVar
from hummingbot.client.settings import AllConnectorSettings, required_exchanges, requried_connector_trading_pairs


def connector_validator(value: str) -> None:
    if value not in AllConnectorSettings.get_connector_settings():
        raise ValueError(f"Invalid connector: {value}. Check `connectors` command to see available connectors.")


def market_validator(value: str) -> None:
    connector = pool_arb_config_map["connector"].value
    return validate_market_trading_pair(connector, value)


def market_on_validated(value: str) -> None:
    connector = pool_arb_config_map["connector"].value
    requried_connector_trading_pairs[connector] = [value]


def exchange_on_validated(value: str) -> None:
    required_exchanges.add(value)


def order_amount_prompt() -> str:
    trading_pair = pool_arb_config_map["trading_pair"].value
    base_asset, quote_asset = trading_pair.split("-")
    return f"What is the amount of {base_asset} per order? >>> "


def market_prompt() -> str:
    connector = pool_arb_config_map.get("connector").value
    example = AllConnectorSettings.get_example_pairs().get(connector)
    return "Enter the token trading pair you would like to trade on %s%s >>> " % (
        connector,
        f" (e.g. {example})" if example else "",
    )


pool_arb_config_map = {
    "strategy": ConfigVar(
        key="strategy",
        prompt="",
        default="pool_arb",
    ),
    "connector": ConfigVar(
        key="connector",
        prompt="Enter your connector (Exchange/AMM/CLOB) >>> ",
        prompt_on_new=True,
        validator=validate_connector,
        on_validated=exchange_on_validated,
    ),
    "trading_pair": ConfigVar(
        key="trading_pair",
        prompt=market_prompt,
        prompt_on_new=True,
        validator=market_validator,
        on_validated=market_on_validated,
    ),
    "order_amount": ConfigVar(
        key="order_amount",
        prompt=order_amount_prompt,
        type_str="decimal",
        validator=lambda v: validate_decimal(v, Decimal("0")),
        prompt_on_new=True,
    ),
    "slippage_buffer": ConfigVar(
        key="slippage_buffer",
        prompt="How much buffer do you want to add to the price to account for slippage (Enter 1 for 1%)? >>> ",
        prompt_on_new=True,
        default=lambda: (
            Decimal(1)
            if pool_arb_config_map["connector"].value
            in sorted(
                AllConnectorSettings.get_gateway_amm_connector_names().union(
                    AllConnectorSettings.get_gateway_clob_connector_names()
                )
            )
            else Decimal(0)
        ),
        validator=lambda v: validate_decimal(v),
        type_str="decimal",
    ),
    "min_profitability": ConfigVar(
        key="min_profitability",
        prompt="What is the minimum profitability for you to make a trade? (Enter 0.01 to indicate 1%) >>> ",
        prompt_on_new=True,
        default=Decimal("0.0005"),
        validator=lambda v: validate_decimal(v),
        type_str="decimal",
    ),
    # "task_cooldown": ConfigVar(
    #     key="task_cooldown",
    #     prompt="How many seconds do you want the strategy to wait before the next arbitrage check? >>> ",
    #     prompt_on_new=True,
    #     default=10,
    #     validator=lambda v: validate_int(v, min_value=1, inclusive=True),
    #     type_str="int",
    # ),
    # "api_price": ConfigVar(
    #     key="api_price",
    #     prompt="What is the fixed rate you want to use for comparison? >>> ",
    #     prompt_on_new=True,
    #     default=0.00029470706118118590121419309206649,
    #     validator=lambda v: validate_decimal(v, Decimal("0"), inclusive=False),
    #     type_str="decimal",
    # ),
    "debug_price_shim": ConfigVar(  # Keeping this as it might be useful for testing
        key="debug_price_shim",
        prompt="Do you want to enable the debug price shim for integration tests? If you don't know what this does, you should keep it disabled. >>> ",
        default=False,
        validator=validate_bool,
        type_str="bool",
    ),
}
