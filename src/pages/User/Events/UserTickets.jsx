// src/pages/User/Events/UserTickets.jsx
import React, { useState, useEffect } from 'react';
import { FaTicketAlt, QrCode } from 'react-icons/fa';
import './UserTickets.css';

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/user/tickets');
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Failed to fetch tickets', error);
      }
    };

    fetchTickets();
  }, []);

  const handleDownloadTicket = (ticket) => {
    // Implement ticket download logic
    console.log('Downloading ticket', ticket);
  };

  return (
    <div className="user-tickets-container">
      <h1>
        <FaTicketAlt /> My Tickets
      </h1>

      {tickets.length === 0 ? (
        <div className="no-tickets">
          <p>You haven't registered for any events yet.</p>
          <button 
            onClick={() => window.location.href = '/user/events/discover'}
          >
            Discover Events
          </button>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <h3>{ticket.event.title}</h3>
                <span className="ticket-status">
                  {ticket.status}
                </span>
              </div>
              
              <div className="ticket-details">
                <div className="ticket-info">
                  <span>Date: {new Date(ticket.event.date).toLocaleDateString()}</span>
                  <span>Location: {ticket.event.venue}</span>
                </div>
                
                <div className="ticket-actions">
                  <button 
                    className="btn-download"
                    onClick={() => handleDownloadTicket(ticket)}
                  >
                    Download Ticket
                  </button>
                  <button 
                    className="btn-qr"
                    onClick={() => {/* Show QR code modal */}}
                  >
                    Show QR Code
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTickets;