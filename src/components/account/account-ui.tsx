import React from 'react';
import { useSolana } from '../solana/solana-provider';
import Button from '../ui/button';
import { Copy, ExternalLink, LogOut, Wallet } from 'lucide-react';

const AccountUI: React.FC = () => {
  const { publicKey, connected, connecting, connect, disconnect } = useSolana();

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
    }
  };

  const handleViewExplorer = () => {
    if (publicKey) {
      window.open(
        `https://explorer.solana.com/address/${publicKey.toString()}`,
        '_blank'
      );
    }
  };

  if (!connected) {
    return (
      <Button
        variant="primary"
        onClick={connect}
        isLoading={connecting}
      >
        <Wallet size={18} />
        <span>Connect Wallet</span>
      </Button>
    );
  }

  return (
    <div className="relative group">
      <Button variant="outline">
        <Wallet size={18} />
        <span className="mx-2">
          {publicKey?.toString().slice(0, 4)}...
          {publicKey?.toString().slice(-4)}
        </span>
      </Button>

      <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <div className="bg-card rounded-lg shadow-lg border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <p className="text-sm text-white/70">Connected Wallet</p>
            <p className="font-medium truncate">
              {publicKey?.toString()}
            </p>
          </div>

          <div className="p-2">
            <button
              onClick={handleCopyAddress}
              className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-white/5"
            >
              <Copy size={16} />
              <span>Copy Address</span>
            </button>

            <button
              onClick={handleViewExplorer}
              className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-white/5"
            >
              <ExternalLink size={16} />
              <span>View on Explorer</span>
            </button>

            <button
              onClick={disconnect}
              className="w-full flex items-center gap-2 p-2 text-left rounded-lg text-error hover:bg-error/10"
            >
              <LogOut size={16} />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountUI;