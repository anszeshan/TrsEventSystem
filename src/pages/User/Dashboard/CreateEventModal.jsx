// src/pages/User/Dashboard/components/CreateEventModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaImage, FaMapMarkerAlt } from 'react-icons/fa';
import './CreateEventModal.css';

const CreateEventModal = ({ onClose, onEventCreated }) => {
  // State to manage form data for event creation
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    venue: '',
    address: '',
    capacity: '',
    image: null,
    isPublic: true
  });

  const [errors, setErrors] = useState({});

  // Handle image upload with preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!eventData.title.trim()) {
      newErrors.title = 'Event title is required';
    }
    
    if (!eventData.description.trim()) {
      newErrors.description = 'Event description is required';
    }
    
    if (!eventData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!eventData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    // Ensure end date is after start date
    if (eventData.startDate && eventData.endDate) {
      const startDateTime = new Date(`${eventData.startDate} ${eventData.startTime}`);
      const endDateTime = new Date(`${eventData.endDate} ${eventData.endTime}`);
      
      if (endDateTime <= startDateTime) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // In a real application, this would be an API call
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        onEventCreated();
        onClose();
      }
    } catch (error) {
      setErrors({ submit: 'Failed to create event. Please try again.' });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-event-modal">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <h2>Create New Event</h2>

        <form onSubmit={handleSubmit} className="event-form">
          {/* Image Upload Section */}
          <div className="image-upload-section">
            {eventData.image ? (
              <div className="image-preview">
                <img src={eventData.image} alt="Event preview" />
                <button 
                  type="button" 
                  className="remove-image"
                  onClick={() => setEventData(prev => ({ ...prev, image: null }))}
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <label className="image-upload-label">
                <FaImage />
                <span>Upload Event Image</span>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* Event Details Section */}
          <div className="form-grid">
            <div className="form-group">
              <label>Event Title*</label>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                className={errors.title ? 'error' : ''}
                placeholder="Enter event title"
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label>Category*</label>
              <select
                value={eventData.category}
                onChange={(e) => setEventData(prev => ({
                  ...prev,
                  category: e.target.value
                }))}
              >
                <option value="">Select category</option>
                <option value="business">Business</option>
                <option value="technology">Technology</option>
                <option value="entertainment">Entertainment</option>
                <option value="sports">Sports</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Description*</label>
              <textarea
                value={eventData.description}
                onChange={(e) => setEventData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                className={errors.description ? 'error' : ''}
                placeholder="Describe your event"
                rows={4}
              />
              {errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>

            {/* Date and Time Section */}
            <div className="form-group">
              <label>Start Date*</label>
              <input
                type="date"
                value={eventData.startDate}
                onChange={(e) => setEventData(prev => ({
                  ...prev,
                  startDate: e.target.value
                }))}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && (
                <span className="error-message">{errors.startDate}</span>
              )}
            </div>

            <div className="form-group">
              <label>Start Time*</label>
              <input
                type="time"
                value={eventData.startTime}
                onChange={(e) => setEventData(prev => ({
                  ...prev,
                  startTime: e.target.value
                }))}
              />
            </div>

            <div className="form-group">
              <label>End Date*</label>
              <input
                type="date"
                value={eventData.endDate}
                onChange={(e) => setEventData(prev => ({
                  ...prev,
                  endDate: e.target.value
                }))}
                className={errors.endDate ? 'error' : ''}
              />
              {errors.endDate && (
                <span className="error-message">{errors.endDate}</span>
              )}
            </div>

            <div className="form-group">
              <label>End Time*</label>
              <input
                type="time"
                value={eventData.endTime}
                onChange={(e) => setEventData(prev => ({
                  ...prev,
                  endTime: e.target.value
                }))}
              />
            </div>

            {/* Location Section */}
            <div className="form-group full-width location-section">
              <label>
                <FaMapMarkerAlt /> Event Location
              </label>
              <input
                type="text"
                value={eventData.venue}
                onChange={(e) => setEventData(prev => ({
                  ...prev,
                  venue: e.target.value
                }))}
                placeholder="Venue name"
                className="venue-input"
              />
              <input
                type="text"
                value={eventData.address}
                onChange={(e) => setEventData(prev => ({
                  ...prev,
                  address: e.target.value
                }))}
                placeholder="Full address"
                className="address-input"
              />
            </div>

            {/* Event Settings */}
            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                min="1"
                value={eventData.capacity}
                onChange={(e) => setEventData(prev => ({
                  ...prev,
                  capacity: e.target.value
                }))}
                placeholder="Maximum attendees"
              />
            </div>

            <div className="form-group visibility-toggle">
              <label>Event Visibility</label>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={eventData.isPublic}
                  onChange={(e) => setEventData(prev => ({
                    ...prev,
                    isPublic: e.target.checked
                  }))}
                />
                <span className="toggle-label">
                  {eventData.isPublic ? 'Public Event' : 'Private Event'}
                </span>
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;