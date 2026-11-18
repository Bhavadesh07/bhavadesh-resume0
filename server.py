"""
Bavadesh Kumar Portfolio — FastAPI Backend Server
==================================================
Live Guestbook API with SQLite database and SQLAlchemy ORM.
Visitors can leave messages that appear in real-time on the portfolio.

Endpoints:
  GET  /api/guestbook         — Fetch all guestbook messages (newest first)
  POST /api/guestbook         — Submit a new guestbook message
  GET  /api/stats             — Portfolio visitor stats & message count
  GET  /                      — Serves the static portfolio (index.html)
  GET  /{path}                — Serves static assets (CSS, JS, images)

Tech Stack: Python 3 · FastAPI · SQLAlchemy · SQLite · Pydantic · Uvicorn
"""

import os
import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker

# ---------------------------------------------------------------------------
# DATABASE SETUP — SQLite + SQLAlchemy ORM
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'portfolio.db')}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class GuestbookEntry(Base):
    """SQLAlchemy model for guestbook messages stored in SQLite."""
    __tablename__ = "guestbook"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=True, default="Visitor")
    message = Column(Text, nullable=False)
    emoji = Column(String(10), nullable=True, default="👋")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class VisitorLog(Base):
    """Tracks unique page visits for the stats endpoint."""
    __tablename__ = "visitor_log"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    visited_at = Column(DateTime, default=datetime.datetime.utcnow)


# Create all tables
Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------------------------
# PYDANTIC SCHEMAS — Request / Response Validation
# ---------------------------------------------------------------------------
class GuestbookCreate(BaseModel):
    """Schema for submitting a new guestbook entry."""
    name: str = Field(..., min_length=1, max_length=100, description="Visitor's name")
    role: Optional[str] = Field("Visitor", max_length=100, description="Visitor's role or title")
    message: str = Field(..., min_length=1, max_length=500, description="The guestbook message")
    emoji: Optional[str] = Field("👋", max_length=10, description="Reaction emoji")

    @field_validator("name", "message")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()


class GuestbookResponse(BaseModel):
    """Schema for returning a guestbook entry."""
    id: int
    name: str
    role: str
    message: str
    emoji: str
    created_at: str  # ISO 8601 string

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    """Portfolio statistics."""
    total_messages: int
    total_visitors: int
    latest_message_at: Optional[str]
    uptime_status: str = "operational"
    api_version: str = "1.0.0"
    tech_stack: list[str] = ["Python", "FastAPI", "SQLAlchemy", "SQLite", "Pydantic"]


# ---------------------------------------------------------------------------
# FASTAPI APPLICATION
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Bavadesh Kumar Portfolio API",
    description="Live Guestbook & Stats API — Python + FastAPI + SQLite",
    version="1.0.0",
)

# CORS — allow the frontend to talk to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# API ROUTES
# ---------------------------------------------------------------------------
@app.get("/api/guestbook", response_model=list[GuestbookResponse], tags=["Guestbook"])
def get_guestbook_entries():
    """Fetch all guestbook messages, newest first."""
    db = SessionLocal()
    try:
        entries = db.query(GuestbookEntry).order_by(GuestbookEntry.created_at.desc()).limit(50).all()
        return [
            GuestbookResponse(
                id=e.id,
                name=e.name,
                role=e.role or "Visitor",
                message=e.message,
                emoji=e.emoji or "👋",
                created_at=e.created_at.isoformat() + "Z" if e.created_at else "",
            )
            for e in entries
        ]
    finally:
        db.close()


@app.post("/api/guestbook", response_model=GuestbookResponse, status_code=201, tags=["Guestbook"])
def create_guestbook_entry(entry: GuestbookCreate):
    """Submit a new guestbook message. Stored in SQLite via SQLAlchemy."""
    db = SessionLocal()
    try:
        new_entry = GuestbookEntry(
            name=entry.name,
            role=entry.role or "Visitor",
            message=entry.message,
            emoji=entry.emoji or "👋",
            created_at=datetime.datetime.utcnow(),
        )
        db.add(new_entry)
        db.commit()
        db.refresh(new_entry)
        return GuestbookResponse(
            id=new_entry.id,
            name=new_entry.name,
            role=new_entry.role,
            message=new_entry.message,
            emoji=new_entry.emoji,
            created_at=new_entry.created_at.isoformat() + "Z",
        )
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        db.close()


@app.get("/api/stats", response_model=StatsResponse, tags=["Stats"])
def get_portfolio_stats():
    """Return portfolio visitor stats and message count."""
    db = SessionLocal()
    try:
        # Log this visit
        db.add(VisitorLog(visited_at=datetime.datetime.utcnow()))
        db.commit()

        total_messages = db.query(GuestbookEntry).count()
        total_visitors = db.query(VisitorLog).count()

        latest = db.query(GuestbookEntry).order_by(GuestbookEntry.created_at.desc()).first()
        latest_at = latest.created_at.isoformat() + "Z" if latest else None

        return StatsResponse(
            total_messages=total_messages,
            total_visitors=total_visitors,
            latest_message_at=latest_at,
        )
    finally:
        db.close()


# ---------------------------------------------------------------------------
# STATIC FILE SERVING — Serve the portfolio frontend
# ---------------------------------------------------------------------------
STATIC_DIR = os.path.join(BASE_DIR)


@app.get("/", tags=["Frontend"])
def serve_index():
    """Serve the main portfolio HTML page."""
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))


# Mount static assets (CSS, JS, images) AFTER API routes
app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")


@app.get("/{filename}", tags=["Frontend"])
def serve_static(filename: str):
    """Serve CSS, JS, and other root-level static files."""
    filepath = os.path.join(STATIC_DIR, filename)
    if os.path.isfile(filepath):
        return FileResponse(filepath)
    raise HTTPException(status_code=404, detail="File not found")


# ---------------------------------------------------------------------------
# ENTRY POINT
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    print("\n" + "=" * 60)
    print("🚀 Bavadesh Kumar Portfolio Server")
    print("   FastAPI + SQLAlchemy + SQLite")
    print("=" * 60)
    print(f"   Portfolio:  http://localhost:8000")
    print(f"   API Docs:   http://localhost:8000/docs")
    print(f"   Guestbook:  http://localhost:8000/api/guestbook")
    print(f"   Stats:      http://localhost:8000/api/stats")
    print("=" * 60 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
