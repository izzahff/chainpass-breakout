import React, { useState, useCallback } from 'react';
import { Wallet, ChevronDown, ExternalLink, Copy, LogOut } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

interface WalletButtonProps {
  fullWidth?: boolean;
}

const WalletButton: React.FC<WalletButtonProps> = ({ fullWidth = false }) => {
  const { publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const walletAddress = publicKey?.toBase58();
  const shortenedAddress = walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : '';

  const toggleConnect = () => {
    if (!publicKey) {
      setVisible(true);
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const disconnectWallet = (e: React.MouseEvent) => {
    e.stopPropagation();
    disconnect();
    setIsDropdownOpen(false);
  };

  const copyAddress = useCallback(async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      alert('Address copied to clipboard');
      setIsDropdownOpen(false);
    }
  }, [walletAddress]);

  const openExplorer = useCallback(() => {
    if (walletAddress) {
      window.open(`https://explorer.solana.com/address/${walletAddress}?cluster=devnet`, '_blank');
      setIsDropdownOpen(false);
    }
  }, [walletAddress]);

  return (
    <div className="relative">
      <button 
        onClick={toggleConnect}
        className={`btn ${publicKey ? 'btn-outline' : 'btn-primary'} ${fullWidth ? 'w-full' : ''}`}
      >
        <Wallet size={18} />
        {publicKey ? (
          <>
            <span>{shortenedAddress}</span>
            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </>
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      {publicKey && isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-card border border-white/10 shadow-lg z-50">
          <div className="p-3 border-b border-white/10">
            <p className="text-sm font-medium text-white/60">Connected Wallet</p>
            <p className="font-medium">{shortenedAddress}</p>
          </div>
          <div className="p-2">
            <button 
              onClick={copyAddress}
              className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-white/5"
            >
              <Copy size={16} /> 
              <span>Copy Address</span>
            </button>
            <button 
              onClick={openExplorer}
              className="w-full flex items-center gap-2 p-2 text-left rounded-lg hover:bg-white/5"
            >
              <ExternalLink size={16} /> 
              <span>View on Explorer</span>
            </button>
            <button 
              onClick={disconnectWallet} 
              className="w-full flex items-center gap-2 p-2 text-left rounded-lg text-error hover:bg-error/10"
            >
              <LogOut size={16} /> 
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletButton;