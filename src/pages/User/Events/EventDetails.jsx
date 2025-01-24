// src/pages/User/Events/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaTicketAlt, 
  FaComment 
} from 'react-icons/fa';
import './EventDetails.css';

const EventDetails = ({ eventId }) => {
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Failed to fetch event details', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/comments`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };

    fetchEventDetails();
    fetchComments();
  }, [eventId]);

  const handleRegister = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST'
      });
      if (response.ok) {
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text: newComment })
      });
      if (response.ok) {
        const newCommentData = await response.json();
        setComments([...comments, newCommentData]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Comment posting failed', error);
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="event-details-container">
      <div className="event-header">
        <img src={event.image} alt={event.title} className="event-hero-image" />
        <div className="event-header-overlay">
          <h1>{event.title}</h1>
          <div className="event-header-meta">
            <span><FaCalendar /> {new Date(event.startDate).toLocaleDateString()}</span>
            <span><FaMapMarkerAlt /> {event.venue}</span>
          </div>
        </div>
      </div>

      <div className="event-details-grid">
        <div className="event-main-details">
          <h2>Event Description</h2>
          <p>{event.description}</p>

          <div className="event-additional-info">
            <div className="info-block">
              <FaUsers />
              <h3>Attendees</h3>
              <p>{event.registeredAttendees}/{event.capacity} Registered</p>
            </div>
            
            <div className="info-block">
              <FaTicketAlt />
              <h3>Ticket Price</h3>
              <p>{event.price === 0 ? 'Free' : `$${event.price}`}</p>
            </div>
          </div>

          {!isRegistered ? (
            <button 
              className="btn-register-event"
              onClick={handleRegister}
            >
              Register for Event
            </button>
          ) : (
            <div className="registered-badge">You're Registered!</div>
          )}
        </div>

        <div className="event-comments-section">
          <h2>Event Discussion</h2>
          
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <img src={comment.user.avatar} alt={comment.user.name} />
                <div className="comment-content">
                  <h4>{comment.user.name}</h4>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="add-comment">
            <textarea 
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment}>
              <FaComment /> Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;