# TENeT Frontend

## Overview

The TENeT frontend is a React application built with Vite that provides an interactive map interface for visualizing telehealth accessibility and internet infrastructure in Alaska.

## Features

- **Interactive Alaska Map**: Leaflet-based mapping with Alaska boundary visualization
- **Responsive Design**: Mobile-friendly interface with proper accessibility
- **Modern React**: Built with React 18 and modern JavaScript features
- **Environment Configuration**: Configurable API endpoints and map settings
- **Clean Architecture**: Modular component structure ready for expansion

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   └── MapView.jsx          # Main map component
├── styles/
│   ├── index.css            # Base styles
│   ├── App.css              # App layout styles
│   └── map.css              # Map-specific styles
├── App.jsx                  # Main application component
└── main.jsx                 # Application entry point
```

## Map Features

- Centered on Alaska with appropriate zoom level
- Alaska boundary visualization with GeoJSON
- Interactive popups with state information
- Responsive design for mobile devices
- OpenStreetMap tiles with proper attribution

## Future Development

This base map is prepared for:
- Healthcare facility markers
- Broadband availability visualization
- Telehealth feasibility metrics
- Interactive filters and controls
- Data integration with backend API

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)
- `VITE_DEFAULT_ZOOM` - Default map zoom level
- `VITE_ALASKA_LAT` - Alaska center latitude
- `VITE_ALASKA_LNG` - Alaska center longitude