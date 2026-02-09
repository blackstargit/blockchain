from decimal import Decimal
from fractions import Fraction
def calculate_slippage(price:Decimal, limit_price:Decimal, trade_direction: str) -> str:
    slippage = None

    if trade_direction == "BUY":
        slippage = abs(limit_price - price) / limit_price
    else:
        slippage = abs(limit_price - price) / price
            
    fraction =  Fraction(slippage).limit_denominator(1000)

    return f"{fraction.numerator}/{fraction.denominator}"

print(calculate_slippage(Decimal(1.02), Decimal(0), "SELL")) 