// // src/pages/Admin/AdminDashboard/AdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   FaUsers,
//   FaCalendarAlt,
//   FaChartLine,
//   FaBell,
//   FaCog,
//   FaSignOutAlt
// } from 'react-icons/fa';
// import DashboardStats from './DashboardStats';
// import ActivityFeed from './ActivityFeed';
// import QuickActions from './QuickActions';
// import SystemHealth from './SystemHealth';
// import './AdminDashboard.css';

// const AdminDashboard = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       // In a real application, this would be an API call
//       const response = await fetch('/api/admin/dashboard');
//       const data = await response.json();
//       setDashboardData(data);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="admin-dashboard">
//       {/* Sidebar Navigation */}
//       {/* <aside className="dashboard-sidebar">
//         <div className="sidebar-header">
//           <h2>EventHub Admin 1</h2>
//         </div>
        
//         <nav className="sidebar-nav">
//           <ul>
//             <li className="active">
//               <FaChartLine />
//               <span>Dashboard</span>
//             </li>
//             <li onClick={() => navigate('/admin/users')}>
//               <FaUsers />
//               <span>User Management</span>
//             </li>
//             <li onClick={() => navigate('/admin/events')}>
//               <FaCalendarAlt />
//               <span>Event Management</span>
//             </li>
//             <li onClick={() => navigate('/admin/reports')}>
//               <FaChartLine />
//               <span>Reports & Analytics</span>
//             </li>
//             <li onClick={() => navigate('/admin/settings')}>
//               <FaCog />
//               <span>Settings</span>
//             </li>
//           </ul>
//         </nav>

//         <div className="sidebar-footer">
//           <button className="logout-btn">
//             <FaSignOutAlt />
//             <span>Logout</span>
//           </button>
//         </div>
//       </aside> */}

//       {/* Main Content Area */}
//       <main className="dashboard-main">
//         {/* Top Header */}
//         {/* <header className="dashboard-header">
//           <div className="header-search">
//             <input 
//               type="search" 
//               placeholder="Search..."
//               className="search-input"
//             />
//           </div>
          
//           <div className="header-actions">
//             <button className="notification-btn">
//               <FaBell />
//               <span className="notification-badge">3</span>
//             </button>
//             <div className="admin-profile">
//               <img src="/admin-avatar.jpg" alt="Admin" />
//               <span>Admin Name</span>
//             </div>
//           </div>
//         </header> */}

//         {/* Dashboard Content */}
//         <div className="dashboard-content">
//           {isLoading ? (
//             <div className="loading-spinner">Loading...</div>
//           ) : (
//             <>
//               <DashboardStats data={dashboardData?.stats} />
//               <div className="dashboard-grid">
//                 <QuickActions />
//                 <ActivityFeed activities={dashboardData?.activities} />
//                 {/* <ActivityFeed activities={dashboardData?.activities} />
//                 <SystemHealth metrics={dashboardData?.systemMetrics} /> */}
//               </div>
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;








import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaBars,
  FaTimes
} from 'react-icons/fa';
 import './AdminDashboard.css';

import DashboardStats from './DashboardStats';
import ActivityFeed from './ActivityFeed';
import QuickActions from './QuickActions';
import SystemHealth from './SystemHealth';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In a real application, this would be an API call
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Implement logout logic
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile Hamburger Menu */}
      <button 
        className="mobile-sidebar-toggle"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Main Content Area */}
      <main className="dashboard-main">
       
        {/* Dashboard Content */}
        <div className="dashboard-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <>
              <DashboardStats data={dashboardData?.stats} />
              <div className="dashboard-grid">
         
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;