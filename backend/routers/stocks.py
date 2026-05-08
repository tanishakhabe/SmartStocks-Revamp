"""
GET /stock/{ticker}   — price, stats, and price history for one stock
GET /compare          — side-by-side stats for two tickers (?a=AAPL&b=MSFT)

Both endpoints call yfinance live. Single-ticker lookups are fast enough
for a request cycle (~200-400 ms). No caching needed for a local app.
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
import yfinance as yf

router = APIRouter()


# ── Response models ───────────────────────────────────────────────────────────

class PricePoint(BaseModel):
    date: str
    price: float


class StockDetail(BaseModel):
    ticker: str
    name: str
    sector: str
    price: float
    change_pct: float          # today's % change
    market_cap: str            # formatted string e.g. "2.95T"
    pe_ratio: float | None
    dividend_yield: float | None
    week_52_high: float
    week_52_low: float
    volume: int
    history: list[PricePoint]  # last 3 months of daily closes


# class StockStats(BaseModel):
#     """Slim stats used in the comparison view."""
#     ticker: str
#     name: str
#     sector: str
#     price: float
#     change_pct: float
#     pe_ratio: float | None
#     dividend_yield: float | None
#     week_52_high: float
#     week_52_low: float
#     market_cap: str
#     history: list[PricePoint]  # for the overlaid chart


# class CompareResponse(BaseModel):
#     a: StockStats
#     b: StockStats


# ── Helpers ───────────────────────────────────────────────────────────────────

def format_market_cap(value: float | None) -> str:
    """Turn a raw number like 2_950_000_000_000 into '2.95T'."""
    if value is None:
        return "N/A"
    if value >= 1e12:
        return f"{value / 1e12:.2f}T"
    if value >= 1e9:
        return f"{value / 1e9:.2f}B"
    if value >= 1e6:
        return f"{value / 1e6:.2f}M"
    return str(value)


def fetch_stock(ticker: str) -> StockDetail:
    """
    Pull info + 3-month history from yfinance and return a StockDetail object.
    Raises HTTPException(404) if the ticker is not found.
    """
    t = yf.Ticker(ticker)
    info = t.info

    # yfinance returns an empty dict (with just a 'trailingPegRatio' key or
    # similar) for unknown tickers — check for a required field to detect this.
    if not info.get("regularMarketPrice") and not info.get("currentPrice"):
        raise HTTPException(status_code=404, detail=f"Ticker '{ticker}' not found")

    price = info.get("currentPrice") or info.get("regularMarketPrice", 0)

    # previousClose lets us calculate today's change percentage
    prev_close  = info.get("previousClose") or price
    change_pct  = ((price - prev_close) / prev_close * 100) if prev_close else 0.0

    # 3-month daily history for the chart
    hist_df = t.history(period="3mo", interval="1d")
    history = [
        PricePoint(date=str(date.date()), price=round(float(close), 2))
        for date, close in hist_df["Close"].items()
    ]

    return StockDetail(
        ticker=ticker.upper(),
        name=info.get("longName") or info.get("shortName", ticker),
        sector=info.get("sector", "Unknown"),
        price=round(price, 2),
        change_pct=round(change_pct, 2),
        pe_ratio=info.get("trailingPE"),
        dividend_yield=info.get("dividendYield"),
        week_52_high=info.get("fiftyTwoWeekHigh", 0),
        week_52_low=info.get("fiftyTwoWeekLow", 0),
        market_cap=format_market_cap(info.get("marketCap")),
        volume=info.get("volume", 0),
        history=history,
    )


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/{ticker}", response_model=StockDetail)
def get_stock(ticker: str):
    """
    Return full detail for a single stock.
    The {ticker} part of the URL is passed in automatically as the `ticker` argument.
    Example: GET /stock/AAPL
    """
    return fetch_stock(ticker.upper())


# @router.get("/compare/", response_model=CompareResponse)
# def compare_stocks(
#     a: str = Query(..., description="First ticker, e.g. AAPL"),
#     b: str = Query(..., description="Second ticker, e.g. MSFT"),
# ):
#     """
#     Return side-by-side stats for two tickers.
#     Query params come after the ? in the URL.
#     Example: GET /stock/compare/?a=AAPL&b=MSFT

#     Query(...) means the param is required — FastAPI returns 422 if missing.
#     """
#     return CompareResponse(
#         a=fetch_stock(a.upper()),
#         b=fetch_stock(b.upper()),
#     )
