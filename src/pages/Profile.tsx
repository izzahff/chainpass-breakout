import React, { useState, useEffect } from 'react';
import { Wallet, TicketIcon, User, Settings, Bell, History, ChevronRight, ExternalLink, Copy, X, BarChart3, DollarSign, Loader2, ArrowLeft } from 'lucide-react';
import { mockEvents } from '../data/mockData';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/events/EventCard';
import { useTickets } from '../lib/TicketContext';
import TicketQRCode from '../components/tickets/TicketQRCode';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const { publicKey, disconnect } = useWallet();
  const navigate = useNavigate();
  const [managedEventId, setManagedEventId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  
  // Use the ticket context instead of local state
  const { userTickets, isLoading, showPurchaseSuccess, refundTicket, forceRefreshTickets, clearAllTickets } = useTickets();
  
  // Redirect to home if wallet is not connected
  useEffect(() => {
    if (!publicKey) {
      navigate('/');
    }
  }, [publicKey, navigate]);

  // Force refresh tickets when component mounts
  useEffect(() => {
    console.log("Profile component mounted, refreshing tickets");
    forceRefreshTickets();
    
    // Debug logging for tickets
    const savedTickets = localStorage.getItem('chainpass_user_tickets');
    if (savedTickets) {
      console.log('Profile - tickets in localStorage:', JSON.parse(savedTickets));
    } else {
      console.log('Profile - no tickets found in localStorage');
    }
  }, [forceRefreshTickets]);

  // Debug log whenever userTickets changes
  useEffect(() => {
    console.log("Profile - userTickets changed:", userTickets);
  }, [userTickets]);

  const walletAddress = publicKey?.toBase58() || '';
  const shortenedAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '';
  
  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'tickets', label: 'My Tickets', icon: <TicketIcon size={18} /> },
    { id: 'transactions', label: 'Transactions', icon: <History size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  // Updated user data with wallet info
  const userData = {
    name: "Wallet User",
    walletAddress: walletAddress,
    joinedDate: "January 2025",
    totalStaked: 1.5,
    activeStakes: 1.0,
    totalEvents: userTickets.length,
  };

  // Mock transaction data
  const transactions = [
    { id: 1, type: 'stake', amount: 0.5, eventName: 'Summer Music Festival', date: 'Mar 15, 2025', status: 'completed' },
    { id: 2, type: 'unstake', amount: 0.5, eventName: 'EDM Extravaganza', date: 'Feb 28, 2025', status: 'completed' },
    { id: 3, type: 'purchase', amount: 0.4, eventName: 'Rock Revolution', date: 'Feb 10, 2025', status: 'completed' },
    { id: 4, type: 'stake', amount: 0.5, eventName: 'Classical Night', date: 'Jan 20, 2025', status: 'pending' },
  ];

  // We're now using userTickets state instead

  const handleManageEvent = (eventId: string) => {
    setManagedEventId(eventId);
  };

  const closeManagePanel = () => {
    setManagedEventId(null);
  };
  
  // Generate mock stats for managed event
  const getManagedEventStats = (eventId: string) => {
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) return null;
    
    // Mock stats
    const totalSold = Math.floor(Math.random() * 100) + 50;
    const totalCapacity = totalSold + event.availableSeats;
    const percentageSold = Math.round((totalSold / totalCapacity) * 100);
    const totalRevenue = totalSold * event.price;
    const stakingProfit = totalRevenue * 0.05; // 5% of total revenue as staking profit
    
    return {
      event,
      totalSold,
      totalCapacity,
      percentageSold,
      totalRevenue,
      stakingProfit
    };
  };

  const copyWalletAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      alert('Address copied to clipboard');
    }
  };

  const openExplorer = () => {
    if (walletAddress) {
      window.open(`https://explorer.solana.com/address/${walletAddress}?cluster=devnet`, '_blank');
    }
  };

  // Handle view ticket QR code
  const handleViewTicket = (event: any) => {
    setSelectedTicket(event);
    setShowQRCode(true);
  };

  if (!publicKey) {
    return null; // Don't render anything if wallet is not connected
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Profile</h1>
        <p className="text-white/70">Manage your account, tickets, and transactions</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl overflow-hidden mb-6">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xl font-bold">
                  W
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{userData.name}</h2>
                  <p className="text-white/70 text-sm">Member since {userData.joinedDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-card-hover rounded-lg px-3 py-2 mt-2 text-sm">
                <span className="text-white/70 truncate">
                  {shortenedAddress}
                </span>
                <button className="text-primary hover:text-primary-dark" onClick={copyWalletAddress}>
                  <Copy size={14} />
                </button>
                <button className="text-primary hover:text-primary-dark" onClick={openExplorer}>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-white/80 hover:bg-card-hover hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Notifications</h3>
              <Bell size={18} />
            </div>
            <p className="text-white/80 text-sm mb-4">
              Stay updated with event announcements, ticket releases, and special offers.
            </p>
            <button className="btn bg-white/10 hover:bg-white/20 w-full backdrop-blur-sm">
              Manage Notifications
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div>
              <div className="bg-card rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Account Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-card-hover rounded-lg p-4">
                    <Wallet className="text-primary mb-2" size={24} />
                    <p className="text-white/70 text-sm">Total Staked</p>
                    <h3 className="text-2xl font-bold">{userData.totalStaked} <span className="text-lg text-white/70">SOL</span></h3>
                  </div>
                  
                  <div className="bg-card-hover rounded-lg p-4">
                    <TicketIcon className="text-primary mb-2" size={24} />
                    <p className="text-white/70 text-sm">Event Tickets</p>
                    <h3 className="text-2xl font-bold">{userData.totalEvents}</h3>
                  </div>
                  
                  <div className="bg-card-hover rounded-lg p-4">
                    <User className="text-primary mb-2" size={24} />
                    <p className="text-white/70 text-sm">Account Status</p>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span className="inline-block h-2 w-2 rounded-full bg-success"></span>
                      Verified
                    </h3>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <h3 className="font-semibold text-lg mb-4">Account Information</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-1">Display Name</label>
                        <input 
                          type="text" 
                          value={userData.name}
                          className="input"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-1">Email Address</label>
                        <input 
                          type="email" 
                          value="wallet-user@example.com"
                          className="input"
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Connected Wallet</label>
                      <div className="input flex items-center justify-between">
                        <span>{walletAddress}</span>
                        <div className="flex items-center gap-2">
                          <button className="text-primary hover:text-primary-dark p-1" onClick={copyWalletAddress}>
                            <Copy size={16} />
                          </button>
                          <button className="text-primary hover:text-primary-dark p-1" onClick={openExplorer}>
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-4">
                    <button className="btn btn-primary">
                      <Settings size={18} />
                      <span>Edit Profile</span>
                    </button>
                    <button className="btn btn-outline" onClick={() => disconnect()}>
                      <Wallet size={18} />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Recent Transactions</h3>
                  <button 
                    onClick={() => setActiveTab('transactions')}
                    className="text-primary hover:text-primary-dark text-sm flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {transactions.slice(0, 3).map(tx => (
                    <div key={tx.id} className="bg-card-hover rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'stake' ? 'bg-primary/20 text-primary' :
                          tx.type === 'unstake' ? 'bg-secondary/20 text-secondary' :
                          'bg-accent/20 text-accent'
                        }`}>
                          {tx.type === 'stake' ? <Wallet size={18} /> : 
                           tx.type === 'unstake' ? <Wallet size={18} /> : 
                           <TicketIcon size={18} />}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{tx.type}</p>
                          <p className="text-white/70 text-sm">{tx.eventName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          tx.type === 'unstake' ? 'text-success' : 
                          tx.type === 'stake' || tx.type === 'purchase' ? 'text-primary' : ''
                        }`}>
                          {tx.type === 'unstake' ? '+' : '-'}{tx.amount} SOL
                        </p>
                        <p className="text-white/70 text-xs">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div>
              {/* Purchase Success Notification */}
              {showPurchaseSuccess && (
                <div className="bg-success/10 border border-success/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                    <TicketIcon size={20} className="text-success" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-success">Purchase Complete!</h4>
                    <p className="text-white/70 text-sm">Your ticket has been added to your collection.</p>
                  </div>
                </div>
              )}
              
              {/* Loading Overlay */}
              {isLoading && (
                <div className="fixed inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-card p-6 rounded-xl max-w-md w-full flex flex-col items-center">
                    <Loader2 size={48} className="text-primary animate-spin mb-4" />
                    <h3 className="text-xl font-medium mb-2">Processing Transaction</h3>
                    <p className="text-white/70 text-center">
                      Please wait while we confirm your transaction on the blockchain.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Manage Event Panel */}
              {managedEventId && (
                <div className="bg-card rounded-xl p-6 mb-6 border border-primary/20">
                  {(() => {
                    const stats = getManagedEventStats(managedEventId);
                    if (!stats) return null;
                    
                    return (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                              <BarChart3 size={24} className="text-primary" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{stats.event.title}</h3>
                              <p className="text-white/70">{stats.event.date}</p>
                            </div>
                          </div>
                          <button 
                            onClick={closeManagePanel}
                            className="p-2 rounded-full hover:bg-white/10"
                          >
                            <X size={20} className="text-white/70" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                              <p className="text-white/70">Staking Profit (est.)</p>
                              <DollarSign size={16} className="text-success" />
                            </div>
                            <h3 className="text-2xl font-bold text-success">{stats.stakingProfit.toFixed(2)} <span className="text-lg text-white/70">SOL</span></h3>
                            <p className="text-white/50 text-sm mt-2">Based on {stats.totalSold} tickets @ {stats.event.price} SOL</p>
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
              )}
              
              <div className="bg-card rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">Your Events</h2>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-lg bg-primary text-white text-sm">All</button>
                    <button className="px-3 py-1 rounded-lg hover:bg-card-hover text-white/70 text-sm">Upcoming</button>
                    <button className="px-3 py-1 rounded-lg hover:bg-card-hover text-white/70 text-sm">Past</button>
                  </div>
                  <div>
                    <input 
                      type="text"
                      placeholder="Search events..."
                      className="bg-card-hover text-white rounded-lg px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-primary w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userTickets.length > 0 ? (
                    userTickets.map(event => (
                      <div key={event.id} className="bg-card-hover rounded-xl overflow-hidden relative">
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-medium">{event.title}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs">
                              Confirmed
                            </span>
                          </div>
                          <p className="text-white/70 text-sm mb-3">{event.date}</p>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <button 
                                onClick={() => handleViewTicket(event)}
                                className="btn btn-sm btn-primary"
                              >
                                View Ticket
                              </button>
                            </div>
                            <div>
                              <button 
                                onClick={() => {
                                  // Add confirmation dialog before refunding
                                  if (confirm(`Are you sure you want to refund your ticket for "${event.title}"? This will process a refund transaction of ${event.price} SOL.`)) {
                                    // Show loading and confirmation message
                                    alert("Please confirm the transaction in your wallet when it appears.");
                                    refundTicket(event.id);
                                  }
                                }}
                                disabled={isLoading}
                                className={`btn btn-sm btn-outline text-warning hover:bg-warning/10 ${
                                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 size={14} className="animate-spin mr-1" />
                                    Refunding...
                                  </>
                                ) : (
                                  <>
                                    <ArrowLeft size={14} className="mr-1" />
                                    Refund
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <TicketIcon size={48} className="text-white/30 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Tickets Yet</h3>
                      <p className="text-white/70 max-w-md mb-6">You haven't purchased any event tickets yet. Browse available events to get started.</p>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => navigate('/events')}
                          className="btn btn-primary"
                        >
                          Explore Events
                        </button>
                        {/* For demo purposes - normally this would be in the event detail page */}
                        <button 
                          onClick={() => navigate('/events')}
                          className="btn btn-outline"
                        >
                          Browse Events
                        </button>
                      </div>
                      
                      {/* Debug buttons */}
                      <div className="flex items-center justify-center gap-3 mt-6">
                        <button
                          onClick={() => {
                            console.log("Manual ticket refresh requested");
                            forceRefreshTickets();
                          }}
                          className="text-sm text-primary/70 hover:text-primary border border-primary/30 rounded px-3 py-1"
                        >
                          Debug: Refresh Tickets
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to clear all tickets? This cannot be undone.")) {
                              clearAllTickets();
                            }
                          }}
                          className="text-sm text-red-500/70 hover:text-red-500 border border-red-500/30 rounded px-3 py-1"
                        >
                          Debug: Clear All Tickets
                        </button>
                        <button
                          onClick={() => {
                            const savedTickets = localStorage.getItem('chainpass_user_tickets');
                            if (savedTickets) {
                              const parsed = JSON.parse(savedTickets);
                              console.log("Current localStorage tickets:", parsed);
                              alert(`Found ${parsed.length} tickets in localStorage. Check console for details.`);
                            } else {
                              console.log("No tickets found in localStorage");
                              alert("No tickets found in localStorage");
                            }
                          }}
                          className="text-sm text-blue-500/70 hover:text-blue-500 border border-blue-500/30 rounded px-3 py-1"
                        >
                          Debug: Check Storage
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="bg-card rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Event</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Status</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-white/70"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.id} className="border-b border-white/10">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              tx.type === 'stake' ? 'bg-primary/20 text-primary' :
                              tx.type === 'unstake' ? 'bg-secondary/20 text-secondary' :
                              'bg-accent/20 text-accent'
                            }`}>
                              {tx.type === 'stake' ? <Wallet size={14} /> : 
                               tx.type === 'unstake' ? <Wallet size={14} /> : 
                               <TicketIcon size={14} />}
                            </div>
                            <span className="capitalize">{tx.type}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-white/70">{tx.eventName}</td>
                        <td className="px-4 py-4">
                          <span className={`${
                            tx.type === 'unstake' ? 'text-success' : 
                            tx.type === 'stake' || tx.type === 'purchase' ? 'text-primary' : ''
                          }`}>
                            {tx.type === 'unstake' ? '+' : '-'}{tx.amount} SOL
                          </span>
                        </td>
                        <td className="px-4 py-4 text-white/70">{tx.date}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tx.status === 'completed' ? 'bg-success/20 text-success' : 
                            'bg-warning/20 text-warning'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button className="text-primary hover:text-primary-dark">
                            <ExternalLink size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-card rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Display Name</label>
                      <input 
                        type="text" 
                        defaultValue={userData.name}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="wallet-user@example.com"
                        className="input"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-3">
                    {[
                      "Email notifications for new events",
                      "Email notifications for ticket reminders",
                      "Email receipts for transactions",
                      "Marketing and promotional emails"
                    ].map((pref, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{pref}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={index < 3} />
                          <div className="w-11 h-6 bg-card-hover peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-medium mb-4">Security</h3>
                  
                  <div className="space-y-4">
                    <button className="btn btn-outline w-full sm:w-auto">
                      Change Password
                    </button>
                    
                    <div className="bg-primary/10 rounded-lg p-4 mt-4">
                      <div className="flex gap-2">
                        <Bell size={18} className="text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-primary">Two-Factor Authentication</h4>
                          <p className="text-white/70 text-sm mt-1">
                            Protect your account with an additional layer of security by enabling two-factor authentication.
                          </p>
                          <button className="mt-2 btn bg-primary/20 hover:bg-primary/30 text-primary text-sm px-4 py-1.5">
                            Enable 2FA
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
                  
                  <div className="bg-card-hover rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet size={20} className="text-primary" />
                      <div>
                        <p className="font-medium">Solana Wallet</p>
                        <p className="text-white/70 text-sm truncate max-w-xs">
                          {walletAddress}
                        </p>
                      </div>
                    </div>
                    <button className="btn btn-ghost text-sm" onClick={() => disconnect()}>
                      Disconnect
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add QR Code Dialog */}
      {selectedTicket && (
        <TicketQRCode 
          isOpen={showQRCode} 
          onClose={() => setShowQRCode(false)} 
          event={selectedTicket} 
        />
      )}
    </div>
  );
};

export default Profile;