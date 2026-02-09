# cython: language_level=3
# distutils: language = c++

from libcpp.string cimport string as c_string
from libcpp.vector cimport vector as c_vector
from libcpp.map cimport map as c_map

from hummingbot.core.data_type.common cimport OrderType, TradeType
from hummingbot.core.event.event_forwarder cimport SourceInfoEventForwarder
from hummingbot.core.event.events import (
    BuyOrderCompletedEvent,
    MarketOrderFailureEvent,
    OrderCancelledEvent,
    SellOrderCompletedEvent,
)
from hummingbot.strategy.script_strategy_base cimport ScriptStrategyBase
from hummingbot.core.data_type.limit_order cimport LimitOrder
from hummingbot.core.data_type.market_order cimport MarketOrder
from decimal import Decimal

cdef class TradeParams:
    """
    Handles data locally
    """
    cdef:
        public str chain
        public str network
        public str connector
        public str base
        public str quote
        public object address

cdef class ArbitrageBalancer(ScriptStrategyBase):
    cdef:
        public str connector
        public str chain
        public str network
        public str trading_pair
        public object order_amount
        public object slippage_buffer
        public object minimum_profitability
        # public float task_cooldown
        # public bint debug_price_shim
        public str base
        public str quote
        public TradeParams trade_params
        public object last_task_time
        public object current_arbitrage_trade
        public dict markets
        public object api_price
        public object dex_price
        
        readonly object _all_markets_ready
        readonly dict _sb_order_tracker
        
    cpdef init_params(self, str connector, str trading_pair, object order_amount, object slippage_buffer,
                      object minimum_profitability)
    cpdef update_api_price(self)
    cpdef object on_tick(self)
    cpdef object on_stop(self)
    cpdef object arbitrage_task(self)
    cpdef object fetch_dex_price(self, object params)
    cpdef object determine_and_execute_trade(self, object params)
    cpdef object calculate_trade_direction(self)
    cpdef object get_wallet_address(self, str chain, str network, str connector)
    cpdef object execute_trade(self, object params, TradeType trade_type, object limit_price)
    cpdef object get_balance(self, object params)
    cpdef object poll_transaction(self, str chain, str network, str tx_hash)
    cpdef did_complete_buy_order(self, object event)
    cpdef did_complete_sell_order(self, object event)
    cpdef did_fail_order(self, object event)
    cpdef did_cancel_order(self, object event)
    cpdef cancel_all_orders(self)