<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Divya Drishti - Vedic Astrology App

A comprehensive Vedic astrology application built with React, Python, and AI-powered insights.

View your app in AI Studio: https://ai.studio/apps/drive/17u8t-V4AS592eNc5NKkhxBaib7ehQjIE

## Features

- **Janampatri (Birth Chart)** - Planetary positions using Swiss Ephemeris
- **Daily Horoscope (Rashifal)** - AI-powered daily predictions via Gemini AI
- **Kundali Matching** - Vedic Ashtakoota compatibility analysis
- **Panchang** - Daily Vedic calendar (Tithi, Nakshatra, etc.)
- **Numerology** - Life Path and Destiny numbers (Premium)
- **Gemstones** - Gemstone recommendations based on birth chart (Premium)
- **Multi-language Support** - English, Hindi, Marathi, Bengali, Gujarati, Tamil, Telugu, Kannada, Malayalam
- **Professional PDF Export** - High-quality print-ready reports

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

**Option 1: Simplified Calculations (Current - main_simple.py)**
- ✅ Works out of the box
- ✅ No additional dependencies
- ⚠️ ~30-40% accuracy (some planetary signs may be incorrect)
- Use for: Demo, testing, non-critical applications

**Option 2: Full Swiss Ephemeris Accuracy (main.py)**
- ✅ 99.9% accuracy (0.001 arcseconds)
- ✅ NASA JPL DE431 based
- ⚠️ Requires Visual C++ Build Tools on Windows

To install pyswisseph for full accuracy:

1. Download Visual C++ Build Tools: https://visualstudio.microsoft.com/visual-c++-build-tools/
2. Install "Desktop development with C++" workload
3. Install pyswisseph:
   ```bash
   pip install pyswisseph==2.10.3.2
   ```
4. Use `main.py` instead of `main_simple.py`

**Note:** Python 3.14 is not supported by pyswisseph pre-built wheels. Use Python 3.11 or 3.12 for easier installation.

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
| Simplified Backend | ~30-40% | Basic orbital formulas |
| Swiss Ephemeris | 99.9% | NASA JPL DE431 |

**Recommendation:** For production use with accurate astrological predictions, install pyswisseph and use the full Swiss Ephemeris backend.

## Environment Variables

Create a `.env.local` file in the root directory:

```
GEMINI_API_KEY=your_gemini_api_key
```

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
