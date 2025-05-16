import React from 'react';
import { AlertTriangle } from 'lucide-react';
import SolanaLogo from './SolanaLogo';

interface ConfirmTransactionProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  fee?: string;
  isLoading?: boolean;
  receiverAddress?: string;
  amount?: string;
}

const ConfirmTransaction: React.FC<ConfirmTransactionProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  fee = '0.00008 SOL',
  isLoading = false,
  receiverAddress = '11111111111111111111111111111111',
  amount = '0.5 SOL'
}) => {
  if (!isOpen) return null;

  // Shorten the address for display
  const shortenedAddress = receiverAddress 
    ? `${receiverAddress.slice(0, 6)}...${receiverAddress.slice(-4)}`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1E1E1E] rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/10 rounded-full flex items-center justify-center">
              <SolanaLogo className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">Confirm Transaction</h3>
              <p className="text-sm text-gray-400">localhost:5173</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4 bg-[#ff6b6b]/10 p-3 rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-[#ff6b6b] flex-shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-[#ff6b6b]">
              This transaction reverted during simulation. Funds may be lost if submitted.
            </p>
          </div>

          <div className="mb-6 space-y-0">
            <div className="py-3 border-b border-gray-700 flex justify-between items-center">
              <span className="text-gray-400">Network</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="font-medium text-white">Solana</span>
              </div>
            </div>
            
            <div className="py-3 border-b border-gray-700 flex justify-between items-center">
              <span className="text-gray-400">Receiver</span>
              <span className="font-medium text-white">{shortenedAddress}</span>
            </div>
            
            <div className="py-3 border-b border-gray-700 flex justify-between items-center">
              <span className="text-gray-400">Amount</span>
              <span className="font-medium text-white">{amount}</span>
            </div>
            
            <div className="py-3 flex justify-between items-center">
              <span className="text-gray-400">Network Fee</span>
              <span className="font-medium text-white">{fee}</span>
            </div>
          </div>

          <p className="text-gray-400 text-sm text-center mb-4">
            Only confirm if you trust this website.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-lg border border-gray-700 text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors flex justify-center items-center disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmTransaction; 