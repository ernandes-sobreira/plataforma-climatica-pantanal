import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { queryClient } from './lib/queryClient';
import { initAuth } from './lib/firebase';
import { seedFirestore } from './lib/seedFirestore';
import './index.css';

async function bootstrap() {
  // Initialize Firebase anonymous auth
  const uid = await initAuth();
  if (uid) {
    // Seed Firestore with initial data if needed
    await seedFirestore();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

bootstrap().catch(console.error);
