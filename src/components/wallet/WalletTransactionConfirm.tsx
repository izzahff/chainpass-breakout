import React from 'react';
import { AlertTriangle } from 'lucide-react';
import SolanaLogo from './SolanaLogo';

interface WalletTransactionConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  network?: string;
  fee?: string;
}

const WalletTransactionConfirm: React.FC<WalletTransactionConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,
  network = 'Solana',
  fee = '0.00008 SOL'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-xl max-w-md w-full shadow-lg">
        <div className="p-5 border-b border-white/10 flex items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center">
              <SolanaLogo className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Confirm Transaction</h3>
              <p className="text-sm text-white/70">localhost:5173</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-warning/10 text-warning rounded-lg p-3 mb-4 flex items-start gap-3">
            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              This transaction reverted during simulation. Funds may be lost if submitted.
            </p>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-white/70">Network</span>
              <span className="font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                {network}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-white/70">Network Fee</span>
              <span className="font-medium">{fee}</span>
            </div>
          </div>

          <p className="text-center text-white/70 text-sm mt-6 mb-4">
            Only confirm if you trust this website.
          </p>

          <div className="flex gap-3">
            <button 
              className="btn btn-outline flex-1"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary flex-1"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTransactionConfirm; 