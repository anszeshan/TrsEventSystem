// src/pages/User/Dashboard/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { 
  FaCalendarPlus, 
  FaList, 
  FaHistory, 
  FaStar 
} from 'react-icons/fa';
import CreatedEventsList from './CreatedEventsList';
import RegisteredEventsList from './RegisteredEventsList';
import CreateEventModal from './CreateEventModal';
import ActivityFeed from './ActivityFeed';
import QuickActions from './QuickActions';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './UserDashboard.css';

const localizer = momentLocalizer(moment);

const UserDashboard = () => {
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [activeTab, setActiveTab] = useState('created');
  const [events, setEvents] = useState({
    created: [],
    registered: []
  });

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      // In a real application, these would be API calls
      const createdEvents = await fetch('/api/user/events/created').then(res => res.json());
      const registeredEvents = await fetch('/api/user/events/registered').then(res => res.json());
      
      setEvents({
        created: createdEvents,
        registered: registeredEvents
      });
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Combine all events for calendar view
  const calendarEvents = [
    ...events.created.map(event => ({
      ...event,
      title: `(Created) ${event.title}`,
      start: new Date(event.startDate),
      end: new Date(event.endDate)
    })),
    ...events.registered.map(event => ({
      ...event,
      title: `(Registered) ${event.title}`,
      start: new Date(event.startDate),
      end: new Date(event.endDate)
    }))
  ];

  return (
    <div className="user-dashboard">
      {/* Quick Actions */}
      <div className="dashboard-grid">
        <QuickActions onCreateEvent={() => setShowCreateEventModal(true)} />
        
        {/* Calendar View */}
        <div className="calendar-section">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      </div>

      {/* Events Management Section */}
      <div className="events-section">
        <div className="events-tabs">
          <button
            className={`tab ${activeTab === 'created' ? 'active' : ''}`}
            onClick={() => setActiveTab('created')}
          >
            <FaList /> Events You Created
          </button>
          <button
            className={`tab ${activeTab === 'registered' ? 'active' : ''}`}
            onClick={() => setActiveTab('registered')}
          >
            <FaStar /> Events You're Attending
          </button>
        </div>

        <div className="events-content">
          {activeTab === 'created' ? (
            <CreatedEventsList events={events.created} onEventUpdate={fetchUserEvents} />
          ) : (
            <RegisteredEventsList events={events.registered} onCancelRegistration={fetchUserEvents} />
          )}
        </div>
      </div>

      {/* Activity Feed */}
      <ActivityFeed />

      {/* Create Event Modal */}
      {showCreateEventModal && (
        <CreateEventModal
          onClose={() => setShowCreateEventModal(false)}
          onEventCreated={fetchUserEvents}
        />
      )}
    </div>
  );
};

export default UserDashboard;