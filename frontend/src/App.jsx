import React from 'react'
import MapView from './components/MapView'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>TENeT</h1>
        <p>Telehealth Network Tool - Alaska</p>
      </header>
      <main className="app-main">
        <MapView />
      </main>
    </div>
  )
}

export default App