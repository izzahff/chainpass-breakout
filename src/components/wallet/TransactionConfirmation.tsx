import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Check, X } from 'lucide-react';
import { useTickets } from '../../lib/TicketContext';

interface TransactionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  fee?: string;
  network?: string;
}

const TransactionConfirmation: React.FC<TransactionConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Transaction',
  message = 'Are you sure you want to submit this transaction?',
  fee = '0.00008 SOL',
  network = 'Solana'
}) => {
  const navigate = useNavigate();
  const { isLoading } = useTickets();

  const handleConfirm = () => {
    onConfirm();
    // The profile navigation will happen after transaction completes
    // in the EventDetails component's handlePurchase function
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-xl max-w-md w-full overflow-hidden shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <button onClick={onClose} className="text-white/50 hover:text-white" disabled={isLoading}>
              <X size={20} />
            </button>
          </div>

          {/* Warning notice for simulation */}
          <div className="bg-warning/10 text-warning rounded-lg p-3 mb-4 flex items-start gap-3">
            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">
              This transaction reverted during simulation. Funds may be lost if submitted.
            </p>
          </div>

          <div className="space-y-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Network</span>
              <span className="font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                {network}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Network Fee</span>
              <span className="font-medium">{fee}</span>
            </div>
          </div>

          <p className="text-center text-white/70 text-sm mb-6">
            Only confirm if you trust this website.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="btn btn-outline flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="btn btn-primary flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Check size={18} className="mr-1" />
              )}
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionConfirmation; 