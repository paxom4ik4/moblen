import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.tsx';
import { BrowserRouter as Router } from 'react-router-dom';

import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

import { QueryClient, QueryClientProvider } from 'react-query';
import { StyledEngineProvider } from '@mui/material';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <StyledEngineProvider injectFirst>
            <App />
          </StyledEngineProvider>
        </QueryClientProvider>
      </Provider>
    </Router>
  </React.StrictMode>,
);
