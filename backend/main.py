from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, climate, prediction, live, satellite

app = FastAPI(
    title="TwinNetra API",
    description="AI-Powered Digital Twin of Odisha's Climate",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    # REMOVE the markdown brackets. It must be exact URL strings:
    allow_origins=["http://localhost:5173", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(climate.router)
app.include_router(prediction.router)
app.include_router(live.router)
app.include_router(satellite.router)


@app.get("/health")
def health():
    return {"status": "ok", "system": "TwinNetra v2.0"}
