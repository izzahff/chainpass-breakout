import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import App from './App.tsx';
import './index.css';
import WalletContextProvider from './components/wallet/WalletProvider';
import { TicketProvider } from './lib/TicketContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletContextProvider>
      <TicketProvider>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <App />
          </motion.div>
        </AnimatePresence>
      </TicketProvider>
    </WalletContextProvider>
  </StrictMode>
);