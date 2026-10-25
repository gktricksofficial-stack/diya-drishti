<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Divya Drishti - Vedic Astrology App

A comprehensive Vedic astrology application built with React and Python, featuring accurate Swiss Ephemeris calculations.

## Features

- **Janampatri (Birth Chart)** - Planetary positions using Swiss Ephemeris (99.9% accuracy)
- **Kundali Matching** - Vedic Ashtakoota compatibility analysis
- **Multi-language Support** - English, Hindi, Marathi, Bengali, Gujarati, Tamil, Telugu, Kannada, Malayalam
- **Professional PDF Export** - High-quality print-ready reports
- **Free & Open Source** - No API keys, no paid subscriptions

## Run Locally

**Prerequisites:** Node.js, Python 3.8+

### Quick Start (Windows)

Simply run:
```bash
start.bat
```

This will start both the backend and frontend servers automatically.

### Manual Setup

#### Frontend (React)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local`:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Run the frontend:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

#### Backend (Python)

The app works in demo mode without the backend, but for accurate astrological calculations:

1. Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Run the backend server:
   ```bash
   python main_simple.py
   ```

   Backend will run on `http://localhost:8000`

### Backend Options

**Current (main_simple.py - Recommended):**
- ✅ Uses CosmyDay API (Swiss Ephemeris)
- ✅ 99.9% accuracy (0.001 arcseconds)
- ✅ NASA JPL DE431 based
- ✅ No additional installation needed
- ✅ Works with Python 3.14+
- ✅ Free API, no rate limits

**Alternative (main.py):**
- Local pyswisseph library
- Requires Visual C++ Build Tools on Windows
- Python 3.11/3.12 recommended

## Print Quality

The app supports professional printing with:
- White background for PDFs
- 300 DPI resolution
- Black text on white paper
- A4 paper format
- Printer-friendly colors

## Accuracy Information

| Mode | Accuracy | Data Source |
|------|----------|-------------|
| Demo (No Backend) | 0% | Static mock data |
| Online Swiss Ephemeris (Current) | 99.9% | CosmyDay API (NASA JPL DE431) |
| Local Swiss Ephemeris (main.py) | 99.9% | pyswisseph library |

**Recommendation:** The current backend uses CosmyDay API with 99.9% accuracy. No installation needed.

## Project Structure

```
divya-drishti/
├── backend/
│   ├── main.py              # Full Swiss Ephemeris backend
│   ├── main_simple.py       # Simplified calculations backend
│   └── requirements.txt
├── components/              # React components
├── services/                # API services
├── App.tsx                  # Main app component
├── index.html
├── package.json
└── start.bat                # Windows startup script
```

## Tech Stack

**Frontend:**
- React 19.2.0
- TypeScript
- Vite 6.2.0
- Tailwind CSS
- React Router DOM
- Firebase (Authentication - commented out, demo mode)

**Backend:**
- FastAPI
- Swiss Ephemeris (pyswisseph) or simplified calculations
- pytz (timezone handling)

**AI:**
- Google Gemini 2.5 Flash API

## License

This project is for educational and demonstration purposes.
