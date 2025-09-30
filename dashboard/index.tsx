import { createRoot } from 'react-dom/client'
import App from './main'
import '../src/index.css'
import '../src/globals.css'
import '../src/styles/accessibility.css'

createRoot(document.getElementById("dashboard-root")!).render(<App />);