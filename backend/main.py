from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from database import init_db
from routers import recommend, stocks

app = FastAPI(title="SmartStocks API")

# ── CORS ──────────────────────────────────────────────────────────────────────
# Browsers treat http://localhost:5173 and http://127.0.0.1:5173 as different
# origins — both must be listed or fetch() fails with "Failed to fetch".
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    init_db()

# ── Routes ────────────────────────────────────────────────────────────────────
# prefix="/recommend" means the router's POST "/" becomes POST "/recommend/"
# prefix="/stock"     means GET "/{ticker}" becomes GET "/stock/{ticker}"
app.include_router(recommend.router, prefix="/recommend", tags=["recommend"])
app.include_router(stocks.router,    prefix="/stock",     tags=["stocks"])


@app.get("/")
async def root():
    """So opening http://localhost:8000/ in a browser does not look like a failed server."""
    return JSONResponse(
        {
            "service": "SmartStocks API",
            "docs": "/docs",
            "health": "/health",
            "example": "/stock/AAPL",
        }
    )


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)


@app.get("/health")
async def health():
    return {"status": "ok"}
