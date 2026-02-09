import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../App'   // <— IMPORTANTE: seu App.tsx está na raiz

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
