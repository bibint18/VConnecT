import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store,persistor } from './redux/store.ts'

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
    </PersistGate>
    </Provider>
  </StrictMode>,
)
