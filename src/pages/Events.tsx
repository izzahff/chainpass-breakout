import React, { useState, useEffect } from 'react';
import { Music, Search, Filter, ChevronDown, X, Sparkles } from 'lucide-react';
import EventCard from '../components/events/EventCard';
import { mockEvents } from '../data/mockData';
import { Event } from '../types';

// For demonstration purposes, we'll assume the user has the first 5 events
const userEventIds = mockEvents.slice(0, 5).map(event => event.id);

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: { min: 0, max: 1 },
    dateRange: { start: '', end: '' },
    onlyEarlyAccess: false,
  });

  // Extract unique categories
  const categories = [...new Set(mockEvents.map(event => event.category))];

  const toggleCategory = (category: string) => {
    if (filters.categories.includes(category)) {
      setFilters({
        ...filters,
        categories: filters.categories.filter(c => c !== category)
      });
    } else {
      setFilters({
        ...filters,
        categories: [...filters.categories, category]
      });
    }
  };

  const toggleEarlyAccess = () => {
    setFilters({
      ...filters,
      onlyEarlyAccess: !filters.onlyEarlyAccess
    });
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 1 },
      dateRange: { start: '', end: '' },
      onlyEarlyAccess: false,
    });
    setSearchQuery('');
  };

  useEffect(() => {
    // First filter out the events that the user has already purchased
    const nonUserEvents = mockEvents.filter(event => !userEventIds.includes(event.id));
    
    let results = nonUserEvents;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(event => 
        event.title.toLowerCase().includes(query) || 
        event.location.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by categories
    if (filters.categories.length > 0) {
      results = results.filter(event => 
        filters.categories.includes(event.category)
      );
    }
    
    // Filter by price range
    results = results.filter(event => 
      event.price >= filters.priceRange.min && 
      event.price <= filters.priceRange.max
    );
    
    // Filter by early access
    if (filters.onlyEarlyAccess) {
      results = results.filter(event => event.earlyAccess);
    }
    
    setFilteredEvents(results);
  }, [searchQuery, filters, userEventIds]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/20 to-transparent py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Events</h1>
            <p className="text-white/70 max-w-2xl mx-auto mb-8">
              Find and secure your tickets for the hottest concerts and events using ChainPass's secure blockchain ticketing system.
            </p>
            
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <Search className="w-5 h-5 text-white/50" />
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, artists, or venues..."
                className="w-full pl-10 pr-4 py-3 bg-card-hover rounded-full border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events List Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Mobile filter button */}
          <div className="md:hidden mb-6">
            <button 
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="btn btn-outline w-full flex items-center justify-center gap-2"
            >
              <Filter size={18} />
              <span>Filters</span>
              <ChevronDown className={`transform transition-transform ${filtersOpen ? 'rotate-180' : ''}`} size={18} />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`md:w-64 flex-shrink-0 ${filtersOpen || 'hidden md:block'}`}>
              <div className="bg-card rounded-xl p-6 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <button 
                    onClick={clearFilters}
                    className="text-primary text-sm hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center">
                        <input 
                          type="checkbox"
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span>{filters.priceRange.min} SOL</span>
                      <span>{filters.priceRange.max} SOL</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={filters.priceRange.max}
                      onChange={(e) => setFilters({
                        ...filters,
                        priceRange: { ...filters.priceRange, max: parseFloat(e.target.value) }
                      })}
                      className="w-full"
                    />
                  </div>
                </div>
                
                {/* Early Access */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <input 
                      type="checkbox"
                      id="early-access"
                      checked={filters.onlyEarlyAccess}
                      onChange={toggleEarlyAccess}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="early-access" className="text-sm cursor-pointer flex items-center gap-1">
                      <Sparkles size={14} className="text-primary" />
                      Early Access Events
                    </label>
                  </div>
                </div>
                
                <div className="md:hidden mt-4">
                  <button 
                    onClick={() => setFiltersOpen(false)}
                    className="w-full btn btn-primary"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
            
            {/* Events Grid */}
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-6">
                <p className="text-white/70">
                  Showing <span className="text-white font-medium">{filteredEvents.length}</span> events
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">Sort by:</span>
                  <select className="bg-card border border-white/10 rounded-lg px-3 py-2 text-sm">
                    <option>Newest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>
              
              {filteredEvents.length === 0 ? (
                <div className="bg-card p-8 rounded-xl text-center">
                  <Music className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No events found</h3>
                  <p className="text-white/70">Try adjusting your filters or search query.</p>
                  <button 
                    onClick={clearFilters}
                    className="mt-4 btn btn-outline"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;