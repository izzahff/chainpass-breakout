import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Ticket, Sparkles, Share2, Heart, Info, Music, BarChart3, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockEvents } from '../data/mockData';
import { Event } from '../types';
import { useTickets } from '../lib/TicketContext';
import { DEFAULT_CONTRACT_ADDRESS } from '../contracts/TicketContract';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const showManage = searchParams.get('manage') === 'true';
  
  const [event, setEvent] = useState<Event | undefined>();
  const [ticketCount, setTicketCount] = useState(1);
  
  // Use the ticket context
  const { purchaseTicket, isLoading, forceRefreshTickets } = useTickets();
  
  useEffect(() => {
    // In a real app, fetch from API
    const foundEvent = mockEvents.find(e => e.id === id);
    setEvent(foundEvent);
  }, [id]);
  
  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
          <Link to="/events" className="btn btn-primary">
            <ArrowLeft size={18} />
            <span>Back to Events</span>
          </Link>
        </div>
      </div>
    );
  }
  
  // Generate mock stats for event management
  const getEventStats = () => {
    // Mock stats
    const totalSold = Math.floor(Math.random() * 100) + 50;
    const totalCapacity = totalSold + event.availableSeats;
    const percentageSold = Math.round((totalSold / totalCapacity) * 100);
    const totalRevenue = totalSold * event.price;
    const stakingProfit = totalRevenue * 0.05; // 5% of total revenue as staking profit
    
    return {
      totalSold,
      totalCapacity,
      percentageSold,
      totalRevenue,
      stakingProfit
    };
  };
  
  const handlePurchase = async () => {
    try {
      console.log(`Initiating purchase for ${ticketCount} tickets of event ${event.title}`);
      console.log("Event details for purchase:", { 
        eventId: event.id, 
        price: event.price, 
        total: event.price * ticketCount
      });
      
      // Inform user that wallet confirmation is about to happen
      alert("Please confirm the transaction in your Phantom wallet when it appears.");
      
      // This will trigger the Phantom wallet transaction confirmation
      const success = await purchaseTicket(event, ticketCount);
      
      if (success) {
        console.log("Purchase successful, refreshing tickets");
        // Make sure to refresh tickets
        forceRefreshTickets();
        
        // Show a manual alert to make sure the user knows the transaction was successful
        alert("Purchase successful! You will be redirected to your tickets page.");
        
        // Add debug output to help troubleshoot
        try {
          const savedTickets = localStorage.getItem('chainpass_user_tickets');
          console.log("Current tickets in localStorage:", savedTickets ? JSON.parse(savedTickets) : "None");
        } catch (e) {
          console.error("Error checking localStorage:", e);
        }
        
        // Navigate to profile page after a longer delay to ensure Solana has time to confirm transaction
        setTimeout(() => {
          console.log("Navigating to profile page");
          // Refresh tickets again before navigating to ensure they're loaded on the profile page
          forceRefreshTickets();
          navigate('/profile');
        }, 3000);
      } else {
        console.log("Purchase was not successful");
        alert("The purchase was not successful. Please check the console for details and try again.");
      }
    } catch (error) {
      console.error("Error during purchase:", error);
      
      // Display more detailed error information
      let errorMessage = "There was an error processing your purchase.";
      
      if (error instanceof Error) {
        errorMessage += ` Error: ${error.message}`;
      }
      
      alert(errorMessage + " Please check the console for more details.");
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-b from-background to-card">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10">
          <Link to={showManage ? "/profile" : "/events"} className="text-white/80 hover:text-white inline-flex items-center gap-1 mb-6">
            <ArrowLeft size={18} />
            <span>Back to {showManage ? "Profile" : "Events"}</span>
          </Link>
          
          {event.earlyAccess && (
            <div className="inline-flex items-center gap-1 bg-primary text-black px-3 py-1 rounded-full text-sm font-medium mb-4 w-fit">
              <Sparkles size={14} />
              <span>Early Access Event</span>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
          
          <div className="flex flex-wrap gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{event.availableSeats} tickets available</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event Management Stats (Shown when accessed from Profile) */}
      {showManage && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-card rounded-xl p-6 border border-primary/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="text-primary" size={24} />
              <span>Event Management</span>
            </h2>
            
            {(() => {
              const stats = getEventStats();
              
              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-card-hover rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-white/70">Tickets Sold</p>
                        <span className="text-sm text-white/50">{stats.percentageSold}% of capacity</span>
                      </div>
                      <h3 className="text-2xl font-bold">{stats.totalSold} <span className="text-lg text-white/70">/ {stats.totalCapacity}</span></h3>
                      
                      <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${stats.percentageSold}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-card-hover rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-white/70">Total Revenue</p>
                        <Ticket size={16} className="text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} <span className="text-lg text-white/70">SOL</span></h3>
                      <p className="text-white/50 text-sm mt-2">{stats.totalSold} tickets @ {event.price} SOL</p>
                    </div>
                    
                    <div className="bg-card-hover rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-white/70">Staking Profit (est.)</p>
                        <DollarSign size={16} className="text-success" />
                      </div>
                      <h3 className="text-2xl font-bold text-success">{stats.stakingProfit.toFixed(2)} <span className="text-lg text-white/70">SOL</span></h3>
                      <p className="text-white/50 text-sm mt-2">5% of total revenue</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-end">
                    <button className="btn btn-outline">
                      Download Report
                    </button>
                    <button className="btn btn-primary">
                      Claim Rewards
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <div className="text-white/80 space-y-4">
                <p>{event.description}</p>
                <p>Join us for an unforgettable evening with amazing performances, incredible sound and lighting production, and an atmosphere like no other. This event is expected to sell out quickly, so secure your tickets today!</p>
              </div>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Lineup</h2>
              <div className="space-y-4">
                {event.lineup && event.lineup.map((artist, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card p-4 rounded-lg flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                      <Music size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{artist.name}</h3>
                      <p className="text-white/60 text-sm">{artist.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4">Venue Information</h2>
              <div className="bg-card rounded-xl overflow-hidden">
                <div className="h-64 bg-primary/20">
                  {/* Map would go here in a real app */}
                  <div className="h-full flex items-center justify-center">
                    <MapPin size={48} className="text-primary/50" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">{event.venue}</h3>
                  <p className="text-white/70 mb-4">{event.address}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/70">
                    <div>
                      <h4 className="font-medium mb-1">Getting There</h4>
                      <p className="text-sm">Public transportation, parking available nearby.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Facilities</h4>
                      <p className="text-sm">Food vendors, bars, restrooms, accessibility options.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          
          {/* Sidebar - Ticket Purchase */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 sticky top-24">
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">{event.price} SOL</h3>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-white/10">
                      <Heart size={20} className="text-white/70" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10">
                      <Share2 size={20} className="text-white/70" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-white/70 mb-4">
                  <Ticket size={16} />
                  <span>{event.availableSeats} tickets available</span>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <label htmlFor="ticket-count" className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-l-lg bg-white/10 hover:bg-white/20"
                      disabled={ticketCount <= 1}
                    >
                      -
                    </button>
                    <input 
                      id="ticket-count"
                      type="number" 
                      value={ticketCount}
                      readOnly
                      className="w-12 h-8 text-center bg-card-hover border-y border-white/10"
                    />
                    <button 
                      onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-r-lg bg-white/10 hover:bg-white/20"
                      disabled={ticketCount >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">Price per ticket:</span>
                  <span>{event.price} SOL</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">Service fee:</span>
                  <span>0.05 SOL</span>
                </div>
                <div className="flex justify-between font-medium mt-2 pt-2 border-t border-white/10">
                  <span>Total:</span>
                  <span>{(event.price * ticketCount + 0.05).toFixed(2)} SOL</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handlePurchase}
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Ticket size={18} />
                      <span>Buy Ticket ({event.price} SOL)</span>
                    </>
                  )}
                </button>
                
                <div className="bg-primary/10 rounded-lg p-4 mt-4">
                  <div className="flex gap-2">
                    <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary">Why Buy Tickets From Us?</h4>
                      <p className="text-white/70 text-sm mt-1">
                        Our blockchain-secured tickets are tamper-proof and verified. Enjoy transparent transactions, exclusive perks, and seamless entry to the best events!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Debug Tools Section - Collapsible */}
                <div className="mt-4 border border-dashed border-white/20 rounded-lg p-4">
                  <details>
                    <summary className="cursor-pointer text-sm font-medium text-white/70 hover:text-white">
                      Debug Tools (Click to expand)
                    </summary>
                    <div className="mt-3 space-y-3 text-sm">
                      <div>
                        <button 
                          onClick={() => {
                            try {
                              const tickets = localStorage.getItem('chainpass_user_tickets');
                              alert(tickets ? `Found tickets: ${tickets}` : 'No tickets found in local storage');
                            } catch (e) {
                              alert(`Error reading localStorage: ${e}`);
                            }
                          }}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs"
                        >
                          Check Local Tickets
                        </button>
                      </div>
                      
                      <div>
                        <button 
                          onClick={() => forceRefreshTickets()}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs"
                        >
                          Force Refresh Tickets
                        </button>
                      </div>
                      
                      <div className="text-xs text-white/60 pt-2">
                        <p>Receiving Address: <code className="bg-black/20 px-1 rounded">{DEFAULT_CONTRACT_ADDRESS}</code></p>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;