import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Sparkles, Settings } from 'lucide-react';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  isProfileCard?: boolean;
  onManageClick?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isProfileCard = false, onManageClick }) => {
  return (
    <div className="card group h-full flex flex-col">
      <div className="relative overflow-hidden aspect-[3/2]">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {event.earlyAccess && (
          <div className="absolute top-3 left-3 bg-primary text-black text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={12} />
            <span>Early Access</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-medium">
                <span className="text-primary">{event.price} SOL</span>
              </p>
              <p className="text-white/70 text-xs flex items-center gap-1">
                <Users size={12} />
                <span>{event.availableSeats} seats left</span>
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
              {event.category}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/events/${event.id}`} className="block hover:text-primary transition-colors">
          <h3 className="font-semibold text-lg line-clamp-1">{event.title}</h3>
        </Link>
        
        <div className="mt-2 space-y-2 text-sm text-white/70 flex-grow">
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>{event.location}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          {isProfileCard ? (
            <div className="flex gap-2">
              <Link 
                to={`/events/${event.id}`} 
                className="flex-1 btn bg-card-hover hover:bg-primary hover:text-white text-white/80"
              >
                View Details
              </Link>
              <Link 
                to={`/events/${event.id}?manage=true`}
                className="btn bg-primary/20 hover:bg-primary/30 text-primary"
                onClick={() => onManageClick && onManageClick(event.id)}
              >
                <Settings size={16} />
                <span>Manage</span>
              </Link>
            </div>
          ) : (
            <Link 
              to={`/events/${event.id}`} 
              className="w-full btn bg-card-hover hover:bg-primary hover:text-white text-white/80"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;