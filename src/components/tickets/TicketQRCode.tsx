import React from 'react';
import QRCode from 'react-qr-code';
import Dialog from '../ui/dialog';
import { Event } from '../../types';
import { Check, TicketIcon } from 'lucide-react';

interface TicketQRCodeProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

const TicketQRCode: React.FC<TicketQRCodeProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  // Generate a unique ticket identifier
  const ticketData = JSON.stringify({
    eventId: event.id,
    title: event.title,
    date: event.date,
    ticketId: `TIX-${event.id}-${Date.now().toString(36)}`,
    issuedAt: new Date().toISOString(),
  });

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Your Ticket QR Code">
      <div className="flex flex-col items-center">
        <div className="mb-4 p-6 bg-white rounded-xl">
          <QRCode
            value={ticketData}
            size={200}
            level="H"
          />
        </div>
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
          <p className="text-white/70">{event.date} • {event.time}</p>
          <p className="text-white/70">{event.location}</p>
        </div>
        
        <div className="bg-success/10 text-success rounded-lg p-3 flex items-start gap-3 mb-6 w-full">
          <Check size={20} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            This QR code is your ticket. Present it at the event entrance for admission.
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-white/70 text-sm mb-6">
          <TicketIcon size={16} />
          <span>Ticket ID: TIX-{event.id}-{Date.now().toString(36).slice(-6)}</span>
        </div>
        
        <button
          onClick={onClose}
          className="btn btn-primary w-full"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
};

export default TicketQRCode; 