import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthenticationProvider } from './contexts/authentication-context'
import { Toaster } from '@/components/ui/sonner'
const queryClient = new QueryClient()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
    });
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthenticationProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors/>
        <App />
      </QueryClientProvider>,
    </AuthenticationProvider>
  </BrowserRouter>
  
    
)
