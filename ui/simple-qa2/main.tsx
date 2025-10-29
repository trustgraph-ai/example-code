import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SocketProvider, NotificationProvider } from '@trustgraph/react-state'

const queryClient = new QueryClient()

const notificationHandler = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message),
  warning: (message: string) => console.warn('Warning:', message),
  info: (message: string) => console.info('Info:', message)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider handler={notificationHandler}>
        <SocketProvider user="trustgraph">
          <App />
        </SocketProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>,
)
