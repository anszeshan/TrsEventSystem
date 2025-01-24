// src/pages/Admin/UserManagement/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaUserEdit, FaBan, FaHistory } from 'react-icons/fa';
import UserActivityModal from './UserActivityModal';
import UserEditModal from './UserEditModal';
import './UserManagement.css';

const UserManagement = () => {
  // State management for users and filters
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateJoined: 'all',
    sortBy: 'newest'
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Apply filters when filters state changes
  useEffect(() => {
    applyFilters();
  }, [filters, users]);

  const fetchUsers = async () => {
    try {
      // In a real application, this would be an API call
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Apply date joined filter
    if (filters.dateJoined !== 'all') {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      filtered = filtered.filter(user => {
        const userDate = new Date(user.dateJoined);
        return filters.dateJoined === 'recent' 
          ? userDate >= thirtyDaysAgo 
          : userDate < thirtyDaysAgo;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.dateJoined) - new Date(a.dateJoined);
      }
      // Add more sorting options as needed
      return 0;
    });

    setFilteredUsers(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleUserAction = async (userId, action) => {
    try {
      // In a real application, this would be an API call
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Update local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId 
              ? { ...user, status: action === 'activate' ? 'active' : 'inactive' }
              : user
          )
        );
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };

  return (
    <div className="user-management">
      {/* Filter Section */}
      <div className="filters-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>

          <select
            value={filters.dateJoined}
            onChange={(e) => handleFilterChange('dateJoined', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="recent">Last 30 Days</option>
            <option value="older">Older</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date Joined</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="user-cell">
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                  <div className="user-info">
                    <span className="user-name">{user.name}</span>
                    <span className="user-role">{user.role}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.dateJoined).toLocaleDateString()}</td>
                <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <button
                    className="action-btn edit"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowEditModal(true);
                    }}
                  >
                    <FaUserEdit />
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => handleUserAction(user.id, 
                      user.status === 'active' ? 'deactivate' : 'activate'
                    )}
                  >
                    <FaBan />
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowActivityModal(true);
                    }}
                  >
                    <FaHistory />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showActivityModal && (
        <UserActivityModal
          user={selectedUser}
          onClose={() => setShowActivityModal(false)}
        />
      )}

      {showEditModal && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onUserUpdate={(updatedUser) => {
            setUsers(prevUsers =>
              prevUsers.map(user =>
                user.id === updatedUser.id ? updatedUser : user
              )
            );
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;