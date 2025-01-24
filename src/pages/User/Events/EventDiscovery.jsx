// src/pages/User/Events/EventDiscovery.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCalendar, FaMapMarkerAlt, FaBookmark } from 'react-icons/fa';
import './EventDiscovery.css';

// Reusable Event Card Component
const EventCard = ({ event, onBookmark, onRegister }) => {
  return (
    <div className="event-discovery-card">
      <div className="event-card-image">
        <img src={event.image} alt={event.title} />
        <button 
          className="bookmark-btn" 
          onClick={() => onBookmark(event)}
          title="Bookmark Event"
        >
          <FaBookmark />
        </button>
      </div>
      <div className="event-card-details">
        <h3>{event.title}</h3>
        <div className="event-card-meta">
          <span>
            <FaCalendar /> {new Date(event.startDate).toLocaleDateString()}
          </span>
          <span>
            <FaMapMarkerAlt /> {event.venue}
          </span>
        </div>
        <p>{event.description.slice(0, 100)}...</p>
        <div className="event-card-actions">
          <button 
            className="btn-register"
            onClick={() => onRegister(event)}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

const EventDiscovery = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    location: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    };
    fetchEvents();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = events;

    if (filters.category) {
      result = result.filter(event => event.category === filters.category);
    }

    if (filters.date) {
      result = result.filter(event => 
        new Date(event.startDate).toLocaleDateString() === new Date(filters.date).toLocaleDateString()
      );
    }

    if (filters.location) {
      result = result.filter(event => 
        event.venue.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (searchTerm) {
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEvents(result);
  }, [filters, searchTerm, events]);

  const handleBookmark = (event) => {
    // Implement bookmark logic
    console.log('Bookmarking event', event);
  };

  const handleRegister = (event) => {
    // Navigate to event details or open registration modal
    console.log('Registering for event', event);
  };

  return (
    <div className="event-discovery-container">
      <div className="discovery-header">
        <h1>Discover Events</h1>
        <div className="search-filter-container">
          <div className="search-input">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-dropdowns">
            <select 
              value={filters.category}
              onChange={(e) => setFilters(prev => ({
                ...prev, 
                category: e.target.value
              }))}
            >
              <option value="">All Categories</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
            </select>

            <input 
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({
                ...prev, 
                date: e.target.value
              }))}
            />

            <input 
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({
                ...prev, 
                location: e.target.value
              }))}
            />
          </div>
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.map(event => (
          <EventCard 
            key={event.id} 
            event={event}
            onBookmark={handleBookmark}
            onRegister={handleRegister}
          />
        ))}
        
        {filteredEvents.length === 0 && (
          <div className="no-events-found">
            <p>No events match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDiscovery;