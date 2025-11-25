# TENeT Data Directory

## Overview

This directory contains geographic data, datasets, and configuration files used by the TENeT application for visualizing telehealth accessibility and internet infrastructure in Alaska.

## Directory Structure

```
data/
├── geojson/
│   └── alaska_boundary.geojson    # Alaska state boundary for mapping
└── README.md                      # This file
```

## Data Files

### Geographic Data

- **`geojson/alaska_boundary.geojson`**: Alaska state boundary in GeoJSON format
  - Used by the frontend map component
  - Contains state name and code properties
  - Simplified polygon for performance

## Future Data Integration

This directory will expand to include:

### Healthcare Data
- Healthcare facility locations (hospitals, clinics, telehealth centers)
- Provider availability and services
- Population density and demographics

### Internet Infrastructure Data
- Broadband availability maps
- Connection speed measurements
- Internet service provider coverage
- Network reliability metrics

### Calculated Metrics
- Telehealth feasibility scores
- Healthcare accessibility indices
- Combined infrastructure and healthcare availability ratings

## Data Sources

Future data will be sourced from:
- Alaska Department of Health and Social Services
- Federal Communications Commission (FCC) broadband maps
- US Census Bureau
- Alaska Native Tribal Health Consortium
- Commercial internet speed testing services

## Data Formats

Supported formats:
- GeoJSON for geographic boundaries and point data
- CSV for tabular data
- JSON for configuration and metadata
- Shapefiles (converted to GeoJSON for web use)

## Usage

Geographic data in this directory is:
1. Copied to `frontend/public/data/` for client-side access
2. Served via the backend API for dynamic loading
3. Used for data processing and analysis scripts