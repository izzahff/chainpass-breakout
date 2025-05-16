import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Calendar, Wallet, AlertCircle, Check, Lock, Ticket, PieChart, Users, BarChart } from 'lucide-react';
import { mockEvents } from '../data/mockData';

const StakingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stakeAmount, setStakeAmount] = useState('0.5');
  const [stakingPeriod, setStakingPeriod] = useState('3');
  const [isStaking, setIsStaking] = useState(false);
  
  const featuredEvents = mockEvents.filter(event => event.earlyAccess).slice(0, 3);
  
  const handleStakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsStaking(true);
    // In a real app, this would connect to the blockchain
    setTimeout(() => {
      setIsStaking(false);
      // Show success message or update UI
    }, 2000);
  };
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <PieChart size={18} /> },
    { id: 'stake', label: 'Stake', icon: <Sparkles size={18} /> },
    { id: 'events', label: 'Your Events', icon: <Calendar size={18} /> },
  ];

  const mockStakingData = {
    totalStaked: 1.2,
    currentRewards: 0.06,
    upcomingEvents: 2,
    status: 'active',
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Organizer Dashboard</h1>
        <p className="text-white/70">Manage your events, track stakes, and grow your audience</p>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-colors ${
              activeTab === tab.id 
                ? 'bg-card text-primary border-b-2 border-primary' 
                : 'text-white/70 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6">
                <h2 className="text-2xl font-bold mb-1">Your Organization Summary</h2>
                <p className="text-white/70">Overview of your events and revenue</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card-hover rounded-lg p-4">
                    <p className="text-white/70 text-sm mb-1">Total SOL Collected</p>
                    <div className="flex items-end gap-1">
                      <h3 className="text-2xl font-bold">{mockStakingData.totalStaked}</h3>
                      <span className="text-white/70">SOL</span>
                    </div>
                  </div>
                  
                  <div className="bg-card-hover rounded-lg p-4">
                    <p className="text-white/70 text-sm mb-1">Active Events</p>
                    <div className="flex items-end gap-1">
                      <h3 className="text-2xl font-bold">{mockStakingData.upcomingEvents}</h3>
                      <span className="text-white/70">events</span>
                    </div>
                  </div>
                  
                  <div className="bg-card-hover rounded-lg p-4">
                    <p className="text-white/70 text-sm mb-1">Total Attendees</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">156</h3>
                      <span className="text-success text-sm">+12%</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Next Event Countdown</h3>
                    <span className="text-white/70 text-sm">Summer Music Festival 2025</span>
                  </div>
                  <div className="staking-progress">
                    <div className="staking-progress-bar" style={{ width: '66%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>Today: May 15, 2025</span>
                    <span>Event: Jul 15, 2025</span>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/events/create" className="btn btn-primary">
                    <Calendar size={18} />
                    <span>Create New Event</span>
                  </Link>
                  <button className="btn btn-outline">
                    <Wallet size={18} />
                    <span>View Revenue</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Your Events</h2>
              
              {featuredEvents.length > 0 ? (
                <div className="space-y-4">
                  {featuredEvents.map(event => (
                    <div key={event.id} className="bg-card-hover rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-primary/10 flex-shrink-0">
                          <img 
                            src={event.image} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-white/70 text-sm">{event.date} • {event.availableSeats} tickets available</p>
                        </div>
                      </div>
                      <Link to={`/events/${event.id}`} className="btn btn-ghost">
                        <span>Manage</span>
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card-hover rounded-lg p-6 text-center">
                  <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No events created yet</h3>
                  <p className="text-white/70 mb-4">Create your first event to start collecting stakes.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setActiveTab('stake')}
                  >
                    <Calendar size={18} />
                    <span>Create Event</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="bg-card rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Organizer Benefits</h2>
              
              <div className="space-y-4">
                {[
                  { 
                    icon: <Wallet className="text-primary" />,
                    title: "Secure Revenue",
                    description: "Collect and reclaim SOL stakes after successful events."
                  },
                  { 
                    icon: <Users className="text-primary" />,
                    title: "Engaged Audience",
                    description: "Staking ensures committed attendees and reduces no-shows."
                  },
                  { 
                    icon: <BarChart className="text-primary" />,
                    title: "Analytics Dashboard",
                    description: "Track attendance, engagement, and financial performance."
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="mt-1 bg-primary/10 w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{benefit.title}</h3>
                      <p className="text-white/70 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Need Help?</h2>
              <p className="text-white/80 mb-4">
                Questions about organizing events? Our support team is here to help you succeed.
              </p>
              <button className="btn bg-white/10 hover:bg-white/20 w-full backdrop-blur-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Staking Tab */}
      {activeTab === 'stake' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6">
                <h2 className="text-2xl font-bold mb-1">Create New Event</h2>
                <p className="text-white/70">Set up your event and start collecting SOL stakes</p>
              </div>
              
              <form onSubmit={handleStakeSubmit} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-white/90 mb-2 font-medium">Event Name</label>
                    <input 
                      type="text" 
                      className="input"
                      placeholder="Summer Music Festival 2025"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 mb-2 font-medium">Ticket Price (SOL)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="input pr-16"
                        placeholder="0.5"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50">
                        SOL
                      </div>
                    </div>
                    <p className="text-white/60 text-sm mt-1">Recommended price: 0.5 SOL</p>
                  </div>
                  
                  <div>
                    <label className="block text-white/90 mb-2 font-medium">Event Date</label>
                    <input 
                      type="date" 
                      className="input"
                    />
                  </div>
                  
                  <div className="bg-card-hover rounded-lg p-4">
                    <h3 className="font-medium mb-2">How the staking process works:</h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="bg-primary/20 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-primary font-bold">1</span>
                        </div>
                        <p className="text-sm">Fans stake SOL to secure tickets for your event</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-primary/20 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-primary font-bold">2</span>
                        </div>
                        <p className="text-sm">Fans receive NFT tickets that verify their access</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-primary/20 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-primary font-bold">3</span>
                        </div>
                        <p className="text-sm">After the event, you reclaim the SOL to fund future events</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary/10 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="text-white/90 text-sm mb-1">
                        As an organizer, you'll receive the staked SOL after the event concludes. This helps ensure committed attendance and provides you with funding for future events.
                      </p>
                      <a href="#" className="text-primary text-sm hover:underline">Learn more about organizing</a>
                    </div>
                  </div>
                  
                  <div>
                    <button 
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isStaking}
                    >
                      {isStaking ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Calendar size={18} />
                          <span>Create Event</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <div>
            <div className="bg-card rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Organizer Benefits</h2>
              
              <div className="space-y-6">
                {[
                  { 
                    step: 1,
                    title: "Fans Stake SOL",
                    description: "Attendees stake SOL to secure their tickets."
                  },
                  { 
                    step: 2,
                    title: "Fans Receive NFT Access",
                    description: "Attendees get blockchain-verified tickets."
                  },
                  { 
                    step: 3,
                    title: "Event Takes Place",
                    description: "Fans attend your event using their NFT tickets."
                  },
                  { 
                    step: 4,
                    title: "Reclaim Staked SOL",
                    description: "After the event, you reclaim the staked SOL for future events."
                  },
                ].map((step) => (
                  <div key={step.step} className="flex gap-4 items-start">
                    <div className="bg-white/10 w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center">
                      <span className="font-bold text-primary">{step.step}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-white/70 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">FAQs</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">When do I receive the SOL?</h3>
                  <p className="text-white/70 text-sm">You can reclaim the staked SOL after your event concludes successfully.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">What if I need to cancel?</h3>
                  <p className="text-white/70 text-sm">If an event is cancelled, the stakes will be returned to attendees automatically.</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">How are tickets verified?</h3>
                  <p className="text-white/70 text-sm">Each ticket is an NFT that can be verified at entry using our scanner app.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="bg-card rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Your Events</h2>
          
          {mockEvents.slice(0, 2).map(event => (
            <div key={event.id} className="ticket-card mb-6">
              <div className="ticket-card-inner">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-32 h-24 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-white/70 text-sm">{event.date} • {event.time}</p>
                        <p className="text-white/70 text-sm">{event.location}</p>
                      </div>
                      
                      <div className="bg-primary/20 rounded-lg px-3 py-1 text-primary text-sm font-medium w-fit">
                        {event.id === '1' ? 'Upcoming' : 'Completed'}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="bg-card-hover rounded-lg px-3 py-1 text-sm flex items-center gap-1">
                        <Ticket size={14} />
                        <span>{event.availableSeats} tickets sold</span>
                      </div>
                      
                      <div className="bg-card-hover rounded-lg px-3 py-1 text-sm flex items-center gap-1">
                        <Sparkles size={14} />
                        <span>Total Staked: {(event.price * 50).toFixed(2)} SOL</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link to={`/events/${event.id}`} className="btn btn-ghost px-4 py-2 text-sm">
                        View Details
                      </Link>
                      
                      {event.id === '1' ? (
                        <button className="btn btn-outline px-4 py-2 text-sm">
                          Edit Event
                        </button>
                      ) : (
                        <button className="btn btn-ghost px-4 py-2 text-sm text-primary">
                          <Wallet size={16} />
                          <span>Reclaim SOL Stakes</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center mt-8">
            <Link to="/events/create" className="btn btn-primary">
              <Calendar size={18} />
              <span>Create New Event</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default StakingDashboard;