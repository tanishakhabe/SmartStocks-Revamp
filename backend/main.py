from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from routers import recommend, stocks

app = FastAPI(title="SmartStocks API")

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allows the Vite dev server (port 5173) to call this API.
# Without this the browser blocks cross-origin requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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

@app.get("/health")
async def health():
    return {"status": "ok"}
