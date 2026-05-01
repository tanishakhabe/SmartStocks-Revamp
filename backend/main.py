from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
# from routers import stocks, recommendations, portfolio, sectors  # uncomment Day 6

app = FastAPI(title="SmartStocks API")

# CORS middleware
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    init_db()

@app.get("/health")
async def health():
    return {"status": "ok"}

# TODO Day 6: app.include_router(stocks.router, prefix="/stocks")
# TODO Day 6: app.include_router(recommendations.router, prefix="/recommend")
# TODO Day 6: app.include_router(portfolio.router, prefix="/portfolio")
# TODO Day 6: app.include_router(sectors.router, prefix="/sectors")