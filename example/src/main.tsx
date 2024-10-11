import { ThemeProvider } from 'next-themes'
import { createRoot } from 'react-dom/client'

import App from './App'
import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider attribute="class">
    <App />
  </ThemeProvider>,
)
