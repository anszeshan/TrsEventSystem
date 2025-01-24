// src/pages/Admin/UserManagement/components/UserEditModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaSave, FaLock, FaUser } from 'react-icons/fa';
import './UserEditModal.css';

const UserEditModal = ({ user, onClose, onUserUpdate }) => {
  // Initialize form state with user data
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    role: user.role,
    status: user.status,
    phoneNumber: user.phoneNumber || '',
    permissions: user.permissions || []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Available permissions that can be assigned to users
  const availablePermissions = [
    { id: 'view_events', label: 'View Events' },
    { id: 'book_events', label: 'Book Events' },
    { id: 'create_reviews', label: 'Create Reviews' },
    { id: 'access_api', label: 'API Access' }
  ];

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle permission toggles
  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => {
      const updatedPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId];
      
      return {
        ...prev,
        permissions: updatedPermissions
      };
    });
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // In a real application, this would be an API call
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onUserUpdate(updatedUser);
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      setErrors({ submit: 'Failed to update user. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <div className="modal-header">
          <h3>Edit User Profile</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="status">Account Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="permissions-section">
            <h4>User Permissions</h4>
            <div className="permissions-grid">
              {availablePermissions.map(permission => (
                <label key={permission.id} className="permission-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                  />
                  <span>{permission.label}</span>
                </label>
              ))}
            </div>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;