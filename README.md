# TENeT: Telehealth Effectiveness and Necessity Tracker


## Architecture

**Frontend:** React 18 + TypeScript + Leaflet  
**Backend:** Flask 3.0 (Python)  
**Build Tool:** Vite  
**Map Platform:** OpenStreetMap

```
TENeT/
├── frontend/          # React application with interactive Alaska map
│   ├── src/
│   │   ├── App.tsx    # Main map component
│   │   └── main.tsx   # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── backend/           # Flask API Gateway
    ├── app.py         # Flask application
    └── requirements.txt
```

## Getting Started

### Prerequisites

- Python 3.9 or higher
- Node.js 18 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip3 install -r requirements.txt
```

3. Start the Flask server:
```bash
python3 app.py
```

The backend will start at `http://localhost:5000`

**Available endpoints:**
- `GET /api/health` - Health check
- `GET /api/info` - Project information

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install npm dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start at `http://localhost:5173`




