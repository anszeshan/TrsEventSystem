// src/pages/User/Dashboard/components/CreatedEventsList.jsx
import React from 'react';
import { FaEdit, FaTrash, FaUsers, FaRegClock } from 'react-icons/fa';
import './EventsList.css';

const CreatedEventsList = ({ events, onEventUpdate }) => {
  // Function to handle event deletion
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // In a real application, this would be an API call
        await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
        onEventUpdate(); // Refresh the events list
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  // Calculate event status based on dates
  const getEventStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'ongoing';
  };

  return (
    <div className="events-list">
      {events.length === 0 ? (
        <div className="no-events">
          <h3>No Events Created Yet</h3>
          <p>Start creating your first event to see it here!</p>
        </div>
      ) : (
        events.map(event => {
          const status = getEventStatus(event.startDate, event.endDate);
          
          return (
            <div key={event.id} className={`event-card ${status}`}>
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <span className={`status-badge ${status}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>

              <div className="event-details">
                <h3>{event.title}</h3>
                <div className="event-meta">
                  <span className="event-date">
                    <FaRegClock />
                    {new Date(event.startDate).toLocaleDateString()}
                  </span>
                  <span className="event-attendees">
                    <FaUsers />
                    {event.registeredAttendees}/{event.capacity} Registered
                  </span>
                </div>
                <div className="attendance-bar">
                  <div 
                    className="attendance-fill"
                    style={{ 
                      width: `${(event.registeredAttendees / event.capacity) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div className="event-actions">
                <button 
                  className="btn-edit"
                  onClick={() => onEventUpdate(event.id)}
                  title="Edit Event"
                >
                  <FaEdit />
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeleteEvent(event.id)}
                  title="Delete Event"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CreatedEventsList;