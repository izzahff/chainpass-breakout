import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, MapPin, Music, Ticket, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import EventCard from '../components/events/EventCard';
import { mockEvents } from '../data/mockData';

const Home: React.FC = () => {
  const [featuredEvents, setFeaturedEvents] = useState(mockEvents.slice(0, 4));
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-background to-card">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 mix-blend-overlay"></div>
          {/* Abstract circles animation */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/20 filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Experience Concerts with 
              <span className="gradient-text block">Blockchain Technology</span>
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Secure your tickets with blockchain technology, enjoy exclusive perks, and trade with confidence on the Solana network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="btn btn-primary">
                <Ticket size={20} />
                <span>Explore Events</span>
              </Link>
              <Link to="/events/create" className="btn btn-outline">
                <Sparkles size={20} />
                <span>Become an Organizer</span>
              </Link>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-0 w-full text-center">
          <button 
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
              });
            }}
            className="animate-bounce text-white/60 hover:text-white"
          >
            <ChevronRight size={24} className="rotate-90" />
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How ChainPass Works</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Secure, transparent, and efficient concert ticketing powered by Solana blockchain technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="text-primary h-10 w-10" />,
                title: "Secure Tickets",
                description: "Purchase tickets with SOL on the blockchain, ensuring authenticity and eliminating fraud."
              },
              {
                icon: <Ticket className="text-primary h-10 w-10" />,
                title: "NFT Tickets",
                description: "Receive your ticket as an NFT on the Solana blockchain, ensuring authenticity and security."
              },
              {
                icon: <Calendar className="text-primary h-10 w-10" />,
                title: "Organizer Funding",
                description: "After successful events, organizers reinvest funds to create even better experiences."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="mb-4 bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-white/70">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured Events</h2>
              <p className="text-white/70 mt-2">Secure your spot at these hot events</p>
            </div>
            <Link to="/events" className="btn btn-outline hidden md:flex">
              <span>View All</span>
              <ChevronRight size={18} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/events" className="btn btn-outline">
              <span>View All Events</span>
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits of Becoming an Organizer */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Benefits of Becoming an Organizer</h2>
              <p className="text-white/70 mb-8">
                Join ChainPass as an event organizer and transform the way you manage events. Access powerful blockchain tools, increase engagement, and grow your revenue.
              </p>
              
              <div className="space-y-4">
                {[
                  { 
                    title: "Secure Revenue Stream", 
                    description: "Collect payments through blockchain for transparent and immediate funding."
                  },
                  { 
                    title: "Reduce No-shows & Scalping", 
                    description: "Blockchain-verified tickets prevent unauthorized reselling and reduce no-shows."
                  },
                  { 
                    title: "Transparent Analytics", 
                    description: "Access real-time data about ticket sales, attendee engagement, and financial performance."
                  },
                  { 
                    title: "Simplified Ticketing Management", 
                    description: "Automate ticket distribution, verification, and post-event processes with smart contracts."
                  },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="mt-1 bg-primary/20 rounded-full p-1">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <ChevronRight size={14} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{benefit.title}</h4>
                      <p className="text-white/70">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link to="/events/create" className="btn btn-primary">
                  <Sparkles size={18} />
                  <span>Become an Organizer</span>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1/2 bg-gradient-to-b from-primary/10 to-transparent"></div>
                
                <h3 className="text-2xl font-bold mb-6 relative z-10">Ticket Flow</h3>
                
                <div className="space-y-6 relative z-10">
                  {[
                    { step: 1, title: "Purchase Tickets", description: "Fans buy blockchain-verified tickets using SOL." },
                    { step: 2, title: "Receive NFT Access", description: "Attendees get verifiable NFT tickets on Solana blockchain." },
                    { step: 3, title: "Attend Event", description: "Fans enjoy the event with their NFT ticket for entry." },
                    { step: 4, title: "Support Future Events", description: "Organizers use funds to create even better experiences." },
                  ].map((step) => (
                    <div key={step.step} className="flex gap-4 items-start">
                      <div className="bg-white/10 w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center backdrop-blur-sm">
                        <span className="font-bold text-primary">{step.step}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-white/70 text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/20 rounded-full filter blur-3xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;