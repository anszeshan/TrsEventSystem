// src/pages/User/Events/MyEvents.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaCalendarCheck, 
  FaCalendarTimes, 
  FaList 
} from 'react-icons/fa';
import './UserEvents.css';

const UserEvents = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState({
    created: [],
    registered: [],
    past: []
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch created events
        const createdResponse = await fetch('/api/user/events/created');
        const createdEvents = await createdResponse.json();

        // Fetch registered events
        const registeredResponse = await fetch('/api/user/events/registered');
        const registeredEvents = await registeredResponse.json();

        // Categorize events
        const now = new Date();
        const pastEvents = [...createdEvents, ...registeredEvents].filter(
          event => new Date(event.endDate) < now
        );

        const upcomingCreatedEvents = createdEvents.filter(
          event => new Date(event.startDate) > now
        );

        const upcomingRegisteredEvents = registeredEvents.filter(
          event => new Date(event.startDate) > now
        );

        setEvents({
          created: upcomingCreatedEvents,
          registered: upcomingRegisteredEvents,
          past: pastEvents
        });
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    };

    fetchEvents();
  }, []);

  const renderEventList = (eventsList) => {
    return eventsList.map(event => (
      <div key={event.id} className="my-event-card">
        <img src={event.image} alt={event.title} />
        <div className="event-details">
          <h3>{event.title}</h3>
          <div className="event-meta">
            <span>
              <FaCalendarCheck /> {new Date(event.startDate).toLocaleDateString()}
            </span>
            <span>
              <FaList /> {event.category}
            </span>
          </div>
        </div>
        <div className="event-actions">
          <button>View Details</button>
        </div>
      </div>
    ));
  };

  return (
    <div className="my-events-container">
      <div className="my-events-header">
        <h1>My Events</h1>
        <div className="events-tabs">
          <button 
            className={activeTab === 'upcoming' ? 'active' : ''}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </button>
          <button 
            className={activeTab === 'created' ? 'active' : ''}
            onClick={() => setActiveTab('created')}
          >
            Created Events
          </button>
          <button 
            className={activeTab === 'past' ? 'active' : ''}
            onClick={() => setActiveTab('past')}
          >
            Past Events
          </button>
        </div>
      </div>

      <div className="events-content">
        {activeTab === 'upcoming' && (
          <div className="upcoming-events">
            <h2>Registered & Created Upcoming Events</h2>
            <div className="events-grid">
              {[...events.created, ...events.registered].length > 0 ? (
                renderEventList([...events.created, ...events.registered])
              ) : (
                <div className="no-events">No upcoming events</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'created' && (
          <div className="created-events">
            <h2>Events You've Created</h2>
            <div className="events-grid">
              {events.created.length > 0 ? (
                renderEventList(events.created)
              ) : (
                <div className="no-events">No created events</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'past' && (
          <div className="past-events">
            <h2>Past Events</h2>
            <div className="events-grid">
              {events.past.length > 0 ? (
                renderEventList(events.past)
              ) : (
                <div className="no-events">No past events</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEvents;