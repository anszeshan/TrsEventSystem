// import React, { useState, useEffect } from 'react';
// import { FaBookmark, FaMapMarkerAlt, FaRegClock, FaTimes } from 'react-icons/fa';
// import './UserBookmarks.css';

// const UserBookmarks = () => {
//   const [bookmarks, setBookmarks] = useState([]);

//   useEffect(() => {
//     fetchUserBookmarks();
//   }, []);

//   // Fetch the user's bookmarked events from the API
//   const fetchUserBookmarks = async () => {
//     try {
//       const response = await fetch('/api/user/bookmarks');
//       const data = await response.json();
//       setBookmarks(data);
//     } catch (error) {
//       console.error('Error fetching user bookmarks:', error);
//     }
//   };

//   // Handle bookmark removal
//   const handleRemoveBookmark = async (eventId) => {
//     if (window.confirm('Are you sure you want to remove this bookmark?')) {
//       try {
//         await fetch(`/api/user/bookmarks/${eventId}`, { method: 'DELETE' });
//         fetchUserBookmarks(); // Refresh the bookmarks list
//       } catch (error) {
//         console.error('Error removing bookmark:', error);
//       }
//     }
//   };

//   // Handle event registration
//   const handleRegisterEvent = async (event) => {
//     try {
//       await fetch(`/api/events/${event.id}/registration`, { method: 'POST' });
//       fetchUserBookmarks(); // Refresh the bookmarks list
//     } catch (error) {
//       console.error('Error registering for event:', error);
//     }
//   };

//   return (
//     <div className="user-bookmarks-page">
//       <h1>Saved Events</h1>

//       {bookmarks.length > 0 ? (
//         <div className="bookmarks-grid">
//           {bookmarks.map(event => (
//             <div key={event.id} className="bookmark-card">
//               <div className="bookmark-image">
//                 <img src={event.image} alt={event.title} />
//                 <button
//                   className="btn-remove-bookmark"
//                   onClick={() => handleRemoveBookmark(event.id)}
//                 >
//                   <FaTimes />
//                 </button>
//               </div>

//               <div className="bookmark-content">
//                 <h3>{event.title}</h3>
//                 <div className="bookmark-details">
//                   <span>
//                     <FaRegClock />
//                     {new Date(event.startDate).toLocaleDateString()}
//                   </span>
//                   <span>
//                     <FaMapMarkerAlt />
//                     {event.venue}
//                   </span>
//                 </div>
//                 <button
//                   className="btn-register"
//                   onClick={() => handleRegisterEvent(event)}
//                 >
//                   Register
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="no-bookmarks">
//           <FaBookmark className="no-bookmarks-icon" />
//           <h3>No Bookmarks Yet</h3>
//           <p>Browse events and bookmark the ones you're interested in.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserBookmarks;



// src/pages/User/Events/UserBookmarks.jsx
import React, { useState, useEffect } from 'react';
import { FaBookmark, FaTrash } from 'react-icons/fa';
import './UserBookmarks.css';

const UserBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch('/api/user/bookmarks');
        const data = await response.json();
        setBookmarks(data);
      } catch (error) {
        console.error('Failed to fetch bookmarks', error);
      }
    };

    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      const response = await fetch(`/api/user/bookmarks/${bookmarkId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove the bookmark from the local state
        setBookmarks(prevBookmarks => 
          prevBookmarks.filter(bookmark => bookmark.id !== bookmarkId)
        );
      }
    } catch (error) {
      console.error('Failed to remove bookmark', error);
    }
  };

  const handleRegisterFromBookmark = async (event) => {
    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST'
      });

      if (response.ok) {
        // Optionally remove from bookmarks after registration
        handleRemoveBookmark(event.id);
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div className="user-bookmarks-container">
      <div className="bookmarks-header">
        <h1>
          <FaBookmark /> My Bookmarks
        </h1>
        <p>Events you've saved for later</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="no-bookmarks">
          <FaBookmark className="empty-icon" />
          <h2>No Bookmarked Events</h2>
          <p>Browse events and bookmark the ones you're interested in!</p>
          <button 
            className="discover-events-btn"
            onClick={() => window.location.href = '/events/discover'}
          >
            Discover Events
          </button>
        </div>
      ) : (
        <div className="bookmarks-grid">
          {bookmarks.map(event => (
            <div key={event.id} className="bookmark-card">
              <div className="bookmark-image">
                <img src={event.image} alt={event.title} />
                <button 
                  className="remove-bookmark"
                  onClick={() => handleRemoveBookmark(event.id)}
                  title="Remove Bookmark"
                >
                  <FaTrash />
                </button>
              </div>
              <div className="bookmark-details">
                <h3>{event.title}</h3>
                <div className="bookmark-meta">
                  <span>
                    <FaBookmark /> Bookmarked on: 
                    {new Date(event.bookmarkedAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{event.description.slice(0, 100)}...</p>
                <div className="bookmark-actions">
                  <button 
                    className="btn-view-details"
                    onClick={() => window.location.href = `/events/${event.id}`}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn-register"
                    onClick={() => handleRegisterFromBookmark(event)}
                  >
                    Register Now
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

export default UserBookmarks;