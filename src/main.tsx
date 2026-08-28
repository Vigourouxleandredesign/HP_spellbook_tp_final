import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { applyColorTokens } from '@/styles/tokens/applyColorTokens'
import App from '@/App'
import '@/styles/global.css'

applyColorTokens()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
