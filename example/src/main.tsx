import { ThemeProvider } from 'next-themes'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class">
      <App />
    </ThemeProvider>
  </StrictMode>,
)
