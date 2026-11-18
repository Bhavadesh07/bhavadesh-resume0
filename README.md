# Bavadesh Kumar — Portfolio Website ✦ 2026

An editorial brutalist, neo-grunge collage portfolio website built with modern HTML5, CSS3, JavaScript, and a live Python + FastAPI + SQLite backend.

![Portfolio Preview](assets/bavadesh.jpg)

## ⚡ Highlights & Features

- **Neo-Editorial Brutalism**: Graph paper grid texture, custom typographic hierarchy with Google Fonts (`Syne`, `Cabinet Grotesk`, `JetBrains Mono`, `Plus Jakarta Sans`, and `Caveat`).
- **Live Guestbook & Stats API (Python + FastAPI)**:
  - Real-time visitor guestbook with SQLite database and SQLAlchemy ORM.
  - Interactive emoji reactions and message feed.
  - Live visitor & message counter endpoints (`/api/stats`, `/api/guestbook`).
  - Interactive Swagger / OpenAPI documentation at `/docs`.
  - Graceful fallback for static hosting (e.g. GitHub Pages).
- **Interactive Designer Crop Box**: Full-body / suit portrait with live coordinate tracking and corner grab handles.
- **Jagged Ripped Paper Section**: Authentic SVG deckle edges separating the grid paper from a deep black canvas.
- **Dual Infinite Marquee Tickers**: Continuously streaming horizontal text marquee behind the portrait.
- **Glowing Neon Red Silhouette Cutout**: Transparent PNG portrait with multi-layered neon drop-shadow glow and interactive 3D mouse parallax tilt.
- **"The Works" Polaroid Cards**: Pinned with realistic masking tape, featuring:
  - **Skill Passport**: Full-stack AI career platform with Google Gemini API & FastAPI.
  - **Smart India Hackathon (SIH)**: Qualified participant project showcase.
  - **Resume Parsing & NLP Engine**: PyMuPDF & semantic skill-matching pipeline.
- **Interactive Polish**:
  - Modal system with in-depth architecture breakdowns.
  - Web Audio API tactile audio click synthesis (with mute toggle).
  - One-click clipboard copy for email and phone.
  - Fully responsive across mobile, tablet, and desktop screens.

## 🛠️ Tech Stack

- **Backend**: Python 3, FastAPI, SQLAlchemy, SQLite, Pydantic, Uvicorn
- **Frontend**: HTML5, CSS3 (Custom Variables, CSS Grid, Flexbox, SVG Filters, Multi-stage Drop Shadows)
- **Scripting**: Vanilla JavaScript (Web Audio API, Parallax 3D Matrix, DOM Modals, Fetch API)
- **Assets**: Transparent cutout PNG, optimized graph grid textures

## 🚀 Quick Start / Local Run

### Option 1: Full-Stack Mode (Python FastAPI Backend + Frontend)

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start the FastAPI server
python3 server.py
```

- **Portfolio**: [http://localhost:8000](http://localhost:8000)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Guestbook API**: [http://localhost:8000/api/guestbook](http://localhost:8000/api/guestbook)

### Option 2: Static Preview Only

```bash
# Run a simple HTTP server
python3 -m http.server 8080
```
Open `http://localhost:8080` in your browser. (The guestbook will display offline mode with a hint to run `server.py`).

---

### 👤 Author
**Bayana Reddy Venkata Bavadesh Kumar**  
- **Role**: Software Developer | Computer Science • AI & ML  
- **University**: Jain University, Bengaluru  
- **Email**: bhavadeshbayana9@gmail.com  
- **Phone**: +91 9515016091
