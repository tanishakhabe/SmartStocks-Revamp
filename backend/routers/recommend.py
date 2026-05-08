"""
POST /recommend

Accepts the user's quiz answers, runs KNN against the pre-built feature
matrix, and returns up to 10 matched tickers with match percentages.

The model files (parquet + scaler) are loaded ONCE when the module is
imported — not on every request. This keeps each request fast.
"""

from pathlib import Path
from typing import Literal

import joblib
import numpy as np
import pandas as pd
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sklearn.neighbors import NearestNeighbors

# ── Paths ─────────────────────────────────────────────────────────────────────
# __file__ is  backend/routers/recommend.py
# .parent      → backend/routers
# .parent.parent → backend
DATA_DIR = Path(__file__).parent.parent / "data"

# ── Load model artifacts at startup (once, not per request) ───────────────────
features_raw_df    = pd.read_parquet(DATA_DIR / "features_raw.parquet")
features_scaled_df = pd.read_parquet(DATA_DIR / "features_scaled.parquet")
scaler             = joblib.load(DATA_DIR / "scaler.pkl")
sector_map         = pd.read_parquet(DATA_DIR / "sector_map.parquet")

# Fill the 6 pe_ratio NaNs with column median so KNN never receives NaN
features_scaled_df.fillna(features_scaled_df.median(numeric_only=True), inplace=True)

# Column groups — must match the order the scaler was fit on in Notebook 2
QUANT_COLS  = ["momentum", "volatility", "pe_ratio", "dividend_yield"]
SECTOR_COLS = [c for c in features_scaled_df.columns if c not in QUANT_COLS]

# ── Preference → feature value mappings ───────────────────────────────────────
# These are computed once from the universe distribution so "low risk" always
# means relative to YOUR 150 stocks, not a hardcoded number.

RISK_TARGET = {
    "low":    features_raw_df["volatility"].quantile(0.25),
    "medium": features_raw_df["volatility"].quantile(0.50),
    "high":   features_raw_df["volatility"].quantile(0.75),
}

GROWTH_TARGET = {
    "growth":   {
        "momentum":       features_raw_df["momentum"].quantile(0.75),
        "dividend_yield": features_raw_df["dividend_yield"].quantile(0.10),
    },
    "balanced": {
        "momentum":       features_raw_df["momentum"].quantile(0.50),
        "dividend_yield": features_raw_df["dividend_yield"].quantile(0.50),
    },
    "income":   {
        "momentum":       features_raw_df["momentum"].quantile(0.25),
        "dividend_yield": features_raw_df["dividend_yield"].quantile(0.75),
    },
}

HORIZON_TARGET = {
    "short":  features_raw_df["pe_ratio"].quantile(0.25),
    "medium": features_raw_df["pe_ratio"].quantile(0.50),
    "long":   features_raw_df["pe_ratio"].quantile(0.75),
}

def year_to_horizon(years: int) -> str:
    """Convert slider value (1-10 years) to a horizon bucket."""
    if years <= 2:
        return "short"
    if years <= 5:
        return "medium"
    return "long"


# ── Request / Response models ──────────────────────────────────────────────────
# Pydantic models define the shape of JSON that comes IN and goes OUT.
# FastAPI validates automatically — if the client sends the wrong type it
# gets a clear 422 error instead of a silent crash.

class RecommendRequest(BaseModel):
    sectors: list[str] = []                              # [] = no preference → all sectors
    risk_tolerance: Literal["low", "medium", "high"] = "medium"
    growth_profile: Literal["growth", "balanced", "income"] = "balanced"
    investment_horizon: int = 5                          # years, 1-10 from the slider


class RecommendedStock(BaseModel):
    ticker: str
    match_pct: float                                     # 0-100, higher = closer match


class RecommendResponse(BaseModel):
    recommendations: list[RecommendedStock]


# ── Router ────────────────────────────────────────────────────────────────────
# A Router is a mini-app that groups related endpoints.
# main.py mounts it under a prefix (e.g. /recommend).

router = APIRouter()


@router.post("/", response_model=RecommendResponse)
def get_recommendations(body: RecommendRequest):
    """
    Run KNN against the pre-built feature matrix and return top 10 matches.

    FastAPI automatically:
      - Parses the JSON body into a RecommendRequest object
      - Validates field types and Literal values
      - Serialises the return value to JSON using RecommendResponse
    """

    horizon_bucket = year_to_horizon(body.investment_horizon)

    # 1. Filter to preferred sectors first, then run KNN on the smaller pool.
    #    Hard constraint: user only wants Tech → only search Tech stocks.
    candidate_df = features_scaled_df.copy()
    if body.sectors:
        sector_mask = pd.Series(False, index=candidate_df.index)
        for s in body.sectors:
            if s in candidate_df.columns:
                sector_mask |= candidate_df[s] == 1
        if sector_mask.any():
            candidate_df = candidate_df[sector_mask]

    # 2. Build the "ideal stock" vector in raw (unscaled) units.
    ideal_raw = {
        "momentum":       GROWTH_TARGET[body.growth_profile]["momentum"],
        "volatility":     RISK_TARGET[body.risk_tolerance],
        "pe_ratio":       HORIZON_TARGET[horizon_bucket],
        "dividend_yield": GROWTH_TARGET[body.growth_profile]["dividend_yield"],
    }

    # 3. Scale using the SAME scaler fit in Notebook 2.
    #    Never use fit_transform here — that recalculates on a single point.
    ideal_df     = pd.DataFrame([ideal_raw], columns=QUANT_COLS)
    ideal_scaled = scaler.transform(ideal_df)            # shape: (1, 4)

    # 4. Fit KNN on quantitative columns only.
    #    Sector columns handled by pre-filtering, not distance calculation.
    n_neighbors = min(10, len(candidate_df))
    knn = NearestNeighbors(n_neighbors=n_neighbors, metric="euclidean")
    knn.fit(candidate_df[QUANT_COLS].values)             # .values avoids sklearn warning

    distances, indices = knn.kneighbors(ideal_scaled)

    # 5. Convert Euclidean distance to a 0-100 match percentage.
    #    Dividing by sqrt(n_features) normalises the scale.
    results = []
    for idx, dist in zip(indices[0], distances[0]):
        ticker    = candidate_df.index[idx]
        match_pct = max(0.0, 100.0 - (dist / np.sqrt(len(QUANT_COLS))) * 100)
        results.append(RecommendedStock(ticker=ticker, match_pct=round(match_pct, 1)))

    return RecommendResponse(recommendations=results)
