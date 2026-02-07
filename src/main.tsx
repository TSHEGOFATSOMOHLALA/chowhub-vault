import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'  // Make sure this line exists
import './index.css'        // Make sure this line exists

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)