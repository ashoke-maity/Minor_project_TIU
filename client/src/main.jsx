import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './routes/App'
import { registerLicense } from "@syncfusion/ej2-base"
import { GoogleOAuthProvider } from '@react-oauth/google'


registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
