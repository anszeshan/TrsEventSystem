// src/pages/Admin/EventManagement/EventManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaCheck, 
  FaTimes, 
  FaStar, 
  FaEdit 
} from 'react-icons/fa';
import EventDetailsModal from './EventDetailsModal';
import CategoryManagement from './CategoryManagement';
import './EventManagement.css';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    timeFrame: 'all',
    search: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // In a real application, this would be an API call
      const response = await fetch('/api/admin/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleEventAction = async (eventId, action) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}/${action}`, {
        method: 'POST'
      });

      if (response.ok) {
        // Update local state based on action
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId 
              ? { ...event, status: action === 'approve' ? 'approved' : 'rejected' }
              : event
          )
        );
      }
    } catch (error) {
      console.error(`Error ${action}ing event:`, error);
    }
  };

  const handleFeatureEvent = async (eventId) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}/feature`, {
        method: 'POST'
      });

      if (response.ok) {
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === eventId
              ? { ...event, featured: !event.featured }
              : event
          )
        );
      }
    } catch (error) {
      console.error('Error featuring event:', error);
    }
  };

  const getEventTimeframe = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (endDate < now) return 'past';
    if (startDate > now) return 'upcoming';
    return 'ongoing';
  };

  const filteredEvents = events.filter(event => {
    if (filters.status !== 'all' && event.status !== filters.status) return false;
    if (filters.category !== 'all' && event.category !== filters.category) return false;
    if (filters.timeFrame !== 'all' && getEventTimeframe(event) !== filters.timeFrame) return false;
    if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="event-management">
      <div className="page-header">
        <h2>Event Management</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowCategoryModal(true)}
        >
          Manage Categories
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="Search events..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="search-input"
        />

        <div className="filter-controls">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.timeFrame}
            onChange={(e) => setFilters(prev => ({ ...prev, timeFrame: e.target.value }))}
          >
            <option value="all">All Time</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="events-table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Event Details</th>
              <th>Organizer</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(event => (
              <tr key={event.id}>
                <td className="event-cell">
                  <div className="event-info">
                    <img src={event.image} alt={event.title} />
                    <div>
                      <h4>{event.title}</h4>
                      <span className="event-category">{event.category}</span>
                    </div>
                  </div>
                </td>
                <td>{event.organizer}</td>
                <td>
                  <div className="event-datetime">
                    <span>{new Date(event.startDate).toLocaleDateString()}</span>
                    <span>{new Date(event.startDate).toLocaleTimeString()}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${event.status}`}>
                    {event.status}
                  </span>
                </td>
                <td>
                  <button 
                    className={`feature-btn ${event.featured ? 'featured' : ''}`}
                    onClick={() => handleFeatureEvent(event.id)}
                  >
                    <FaStar />
                  </button>
                </td>
                <td className="actions-cell">
                  <button
                    className="action-btn view"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowDetailsModal(true);
                    }}
                  >
                    View
                  </button>
                  {event.status === 'pending' && (
                    <>
                      <button
                        className="action-btn approve"
                        onClick={() => handleEventAction(event.id, 'approve')}
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="action-btn reject"
                        onClick={() => handleEventAction(event.id, 'reject')}
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showDetailsModal && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showCategoryModal && (
        <CategoryManagement
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
};

export default EventManagement;