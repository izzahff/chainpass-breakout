import React, { createContext, useContext, useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

interface SolanaContextType {
  connection: Connection | null;
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const SolanaContext = createContext<SolanaContextType>({
  connection: null,
  publicKey: null,
  connected: false,
  connecting: false,
  connect: async () => {},
  disconnect: async () => {},
});

export const useSolana = () => useContext(SolanaContext);

export const SolanaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const initConnection = () => {
      const conn = new Connection(
        process.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
        'confirmed'
      );
      setConnection(conn);
    };

    initConnection();
  }, []);

  const connect = async () => {
    try {
      setConnecting(true);
      
      if (!window.solana) {
        throw new Error('Solana wallet not found');
      }

      const response = await window.solana.connect();
      const publicKey = new PublicKey(response.publicKey.toString());
      
      setPublicKey(publicKey);
      setConnected(true);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (window.solana) {
        await window.solana.disconnect();
      }
      setPublicKey(null);
      setConnected(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  };

  return (
    <SolanaContext.Provider
      value={{
        connection,
        publicKey,
        connected,
        connecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
};

export default SolanaProvider;