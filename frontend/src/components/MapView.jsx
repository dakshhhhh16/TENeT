import React, { useEffect, useState, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../styles/map.css'

// Alaska coordinates and zoom levels
const ALASKA_CENTER = [64.0685, -152.2782]
const ALASKA_OVERVIEW_ZOOM = 4
const ALASKA_DETAIL_ZOOM = 6

// Major Alaska cities and regions for detailed exploration
const ALASKA_REGIONS = [
  { name: 'Anchorage', coords: [61.2181, -149.9003], zoom: 10, type: 'city' },
  { name: 'Fairbanks', coords: [64.8378, -147.7164], zoom: 10, type: 'city' },
  { name: 'Juneau', coords: [58.3019, -134.4197], zoom: 10, type: 'city' },
  { name: 'Sitka', coords: [57.0531, -135.3300], zoom: 10, type: 'city' },
  { name: 'Ketchikan', coords: [55.3422, -131.6461], zoom: 10, type: 'city' },
  { name: 'Nome', coords: [64.5011, -165.4064], zoom: 9, type: 'remote' },
  { name: 'Barrow (Utqiagvik)', coords: [71.2906, -156.7886], zoom: 9, type: 'remote' },
  { name: 'Kodiak', coords: [57.7900, -152.4044], zoom: 9, type: 'island' },
]

// Custom marker icons for different region types
const createCustomIcon = (type, name, zoom) => {
  const iconMap = {
    city: '🏙️',
    remote: '🏔️', 
    island: '🏝️'
  }
  
  // Adjust marker size and label visibility based on zoom
  const markerSize = zoom <= 5 ? 30 : 40
  const showLabel = zoom >= 4
  const iconSize = zoom <= 5 ? '1.2rem' : '1.5rem'
  
  return L.divIcon({
    html: `
      <div class="custom-marker ${type}" data-zoom="${zoom}">
        <span class="marker-icon" style="font-size: ${iconSize}">${iconMap[type] || '📍'}</span>
        ${showLabel ? `<span class="marker-label">${name}</span>` : ''}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [markerSize, markerSize],
    iconAnchor: [markerSize/2, markerSize]
  })
}

// Alaska Region Markers Component
const AlaskaRegionMarkers = ({ regions, onRegionClick, currentZoom }) => {
  return (
    <>
      {regions.map((region, index) => (
        <Marker
          key={`${index}-${currentZoom}`} // Re-render when zoom changes
          position={region.coords}
          icon={createCustomIcon(region.type, region.name, currentZoom)}
          eventHandlers={{
            click: () => onRegionClick(region)
          }}
        >
          <Popup>
            <div className="region-popup">
              <h4>🎯 {region.name}</h4>
              <p><strong>Type:</strong> {region.type.charAt(0).toUpperCase() + region.type.slice(1)}</p>
              <p><strong>Coordinates:</strong> {region.coords[0].toFixed(4)}, {region.coords[1].toFixed(4)}</p>
              <button 
                onClick={() => onRegionClick(region)}
                className="explore-region-btn"
              >
                🔍 Explore Region
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

// Map configuration
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

// Zoom Tracking Component
const ZoomTracker = ({ onZoomChange }) => {
  const map = useMap()

  useEffect(() => {
    const handleZoomEnd = () => {
      const zoom = map.getZoom()
      onZoomChange(zoom)
    }

    map.on('zoomend', handleZoomEnd)
    map.on('moveend', handleZoomEnd)
    
    // Initial zoom
    handleZoomEnd()

    return () => {
      map.off('zoomend', handleZoomEnd)
      map.off('moveend', handleZoomEnd)
    }
  }, [map, onZoomChange])

  return null
}

// Map Animation Controller Component
const MapAnimationController = ({ targetView, onAnimationComplete }) => {
  const map = useMap()

  useEffect(() => {
    if (targetView) {
      const { center, zoom, duration = 2000 } = targetView
      
      // Smooth fly-to animation
      map.flyTo(center, zoom, {
        duration: duration / 1000, // Leaflet uses seconds
        easeLinearity: 0.1,
        animate: true
      })

      // Call completion callback after animation
      const timeoutId = setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete()
      }, duration)

      return () => clearTimeout(timeoutId)
    }
  }, [map, targetView, onAnimationComplete])

  return null
}

// GeoJSON styling with hover effects
const alaskaBoundaryStyle = {
  color: '#2E7D32',
  weight: 3,
  opacity: 0.8,
  fillColor: '#4CAF50',
  fillOpacity: 0.1,
  className: 'alaska-boundary-interactive'
}

const alaskaBoundaryHoverStyle = {
  color: '#1B5E20',
  weight: 4,
  opacity: 1,
  fillColor: '#66BB6A',
  fillOpacity: 0.3
}

const MapView = () => {
  const [alaskaBoundary, setAlaskaBoundary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentView, setCurrentView] = useState('overview')
  const [targetView, setTargetView] = useState(null)
  const [showRegions, setShowRegions] = useState(true)
  const [showBoundary, setShowBoundary] = useState(true)
  const [currentZoom, setCurrentZoom] = useState(ALASKA_OVERVIEW_ZOOM)
  const mapRef = useRef(null)

  // Load Alaska GeoJSON data
  useEffect(() => {
    const loadAlaskaBoundary = async () => {
      try {
        // In production, this would come from your API or public folder
        // For now, we'll use a simplified Alaska boundary
        const response = await fetch('/data/alaska_boundary.geojson')
        
        if (!response.ok) {
          // Fallback to a simple Alaska boundary if file not found
          const fallbackData = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  name: "Alaska",
                  state_code: "AK"
                },
                geometry: {
                  type: "Polygon",
                  coordinates: [[
                    [-179.148909, 51.214183],
                    [-179.148909, 71.365162],
                    [-129.979506, 71.365162],
                    [-129.979506, 51.214183],
                    [-179.148909, 51.214183]
                  ]]
                }
              }
            ]
          }
          setAlaskaBoundary(fallbackData)
        } else {
          const data = await response.json()
          setAlaskaBoundary(data)
        }
      } catch (err) {
        console.warn('Failed to load Alaska boundary:', err.message)
        setError('Failed to load Alaska boundary data')
        
        // Use fallback data even on error
        const fallbackData = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                name: "Alaska",
                state_code: "AK"
              },
              geometry: {
                type: "Polygon",
                coordinates: [[
                  [-179.148909, 51.214183],
                  [-179.148909, 71.365162],
                  [-129.979506, 71.365162],
                  [-129.979506, 51.214183],
                  [-179.148909, 51.214183]
                ]]
              }
            }
          ]
        }
        setAlaskaBoundary(fallbackData)
      } finally {
        setLoading(false)
      }
    }

    loadAlaskaBoundary()
  }, [])

  // Handle Alaska boundary interactions
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      // Enhanced popup with exploration option
      layer.bindPopup(`
        <div class="alaska-popup">
          <h3>🏔️ ${feature.properties.name}</h3>
          <p><strong>State Code:</strong> ${feature.properties.state_code || 'N/A'}</p>
          <p><strong>Area:</strong> 665,384 sq miles</p>
          <p><strong>Population:</strong> ~733,000</p>
          <button 
            onclick="window.exploreAlaska()" 
            class="explore-button"
          >
            🔍 Explore Alaska
          </button>
        </div>
      `)

      // Mouse events for visual feedback
      layer.on({
        mouseover: (e) => {
          e.target.setStyle(alaskaBoundaryHoverStyle)
        },
        mouseout: (e) => {
          e.target.setStyle(alaskaBoundaryStyle)
        },
        click: () => {
          handleAlaskaExploration()
        }
      })
    }
  }

  // Handle zoom level changes
  const handleZoomChange = useCallback((zoom) => {
    setCurrentZoom(zoom)
    
    // Show/hide boundary and regions based on zoom level
    if (zoom > 6) {
      setShowBoundary(false)
      setShowRegions(true) // Keep regions visible when boundary disappears
    } else {
      setShowBoundary(true)
      setShowRegions(true) // Show regions WITH boundary in overview
    }
    
    // Update view state based on zoom
    if (zoom <= 5) {
      setCurrentView('overview')
    } else if (zoom <= 8) {
      setCurrentView('detail')
    } else {
      setCurrentView('region')
    }
  }, [])

  // Handle Alaska exploration animation
  const handleAlaskaExploration = useCallback(() => {
    if (currentZoom <= 5) {
      // Zoom into Alaska for detailed view
      setTargetView({
        center: ALASKA_CENTER,
        zoom: ALASKA_DETAIL_ZOOM,
        duration: 2500
      })
    } else {
      // Zoom back out to overview
      setTargetView({
        center: ALASKA_CENTER,
        zoom: ALASKA_OVERVIEW_ZOOM,
        duration: 2000
      })
    }
  }, [currentZoom])

  // Handle region exploration
  const handleRegionExploration = (region) => {
    setTargetView({
      center: region.coords,
      zoom: region.zoom,
      duration: 1500
    })
    setCurrentView('region')
  }

  // Reset to Alaska overview
  const resetToOverview = () => {
    setTargetView({
      center: ALASKA_CENTER,
      zoom: ALASKA_OVERVIEW_ZOOM,
      duration: 2000
    })
  }

  // Zoom out to world view
  const zoomToWorld = () => {
    setTargetView({
      center: [20, 0], // World center
      zoom: 2,
      duration: 2500
    })
  }

  // Add global function for popup button
  useEffect(() => {
    window.exploreAlaska = handleAlaskaExploration
    return () => {
      delete window.exploreAlaska
    }
  }, [handleAlaskaExploration])

  if (loading) {
    return (
      <div className="map-loading">
        <p>Loading Alaska map...</p>
      </div>
    )
  }

  return (
    <div className="map-container">
      {error && (
        <div className="map-error">
          <p>{error}</p>
        </div>
      )}
      
      <MapContainer
        center={ALASKA_CENTER}
        zoom={ALASKA_OVERVIEW_ZOOM}
        className="leaflet-map"
        zoomControl={true}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
        keyboard={true}
        ref={mapRef}
        worldCopyJump={true}
        maxBounds={null}
      >
        <TileLayer
          attribution={TILE_ATTRIBUTION}
          url={TILE_URL}
          maxZoom={18}
          minZoom={1}
        />
        
        <ZoomTracker onZoomChange={handleZoomChange} />
        
        <MapAnimationController 
          targetView={targetView} 
          onAnimationComplete={() => setTargetView(null)}
        />
        
        {alaskaBoundary && showBoundary && (
          <GeoJSON
            data={alaskaBoundary}
            style={alaskaBoundaryStyle}
            onEachFeature={onEachFeature}
          />
        )}
        
        {showRegions && (
          <AlaskaRegionMarkers 
            regions={ALASKA_REGIONS}
            onRegionClick={handleRegionExploration}
            currentZoom={currentZoom}
          />
        )}
      </MapContainer>
      
      <div className="map-info">
        <div className="map-status">
          <h4>🗺️ TENeT Alaska Explorer</h4>
          <p className="current-view">
            {currentView === 'overview' && '🌍 Overview Mode'}
            {currentView === 'detail' && '🏔️ Alaska Detail Mode'}
            {currentView === 'region' && '📍 Region Explorer'}
          </p>
          <small className="zoom-info">
            Zoom: {currentZoom.toFixed(1)} | {showBoundary ? 'Boundary Visible' : 'Free Navigation'}
          </small>
          <small className="interaction-hint">
            {currentZoom <= 5 
              ? 'Click locations or boundary to explore Alaska' 
              : 'Pan freely or use controls to navigate'}
          </small>
        </div>
        
        <div className="map-controls">
          {currentZoom > 5 && (
            <button 
              className="control-button reset-button"
              onClick={resetToOverview}
              title="Return to Alaska overview"
            >
              🏔️ Alaska
            </button>
          )}
          
          {currentZoom > 3 && (
            <button 
              className="control-button world-button"
              onClick={zoomToWorld}
              title="View world map"
            >
              🌍 World
            </button>
          )}
          
          {showRegions && showBoundary && (
            <div className="regions-info">
              <small>📍 {ALASKA_REGIONS.length} Alaska locations visible</small>
            </div>
          )}
          
          {!showBoundary && (
            <div className="navigation-info">
              <small>🧭 Free navigation enabled - explore the world!</small>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MapView