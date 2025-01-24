import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { setUser, getRedirectPath } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'user',
    adminCode: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Validate first name and last name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Admin-specific validation
    if (formData.role === 'admin' && !formData.adminCode) {
      newErrors.adminCode = 'Admin verification code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call for registration
      const response = await simulateApiCall();
      
      if (response.success) {
        setUser(response.user);
        navigate(getRedirectPath(response.user.role));
      }
    } catch (error) {
      setErrors({
        submit: 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate API call (remove in production)
  const simulateApiCall = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: {
            id: '123',
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            role: formData.role
          }
        });
      }, 1000);
    });
  };

  const renderRoleSpecificFields = () => {
    if (formData.role === 'admin') {
      return (
        <div className="form-group">
          <label htmlFor="adminCode">Admin Verification Code</label>
          <input
            type="text"
            id="adminCode"
            name="adminCode"
            value={formData.adminCode}
            onChange={handleChange}
            className={`form-control ${errors.adminCode ? 'error' : ''}`}
            placeholder="Enter admin verification code"
          />
          {errors.adminCode && (
            <span className="error-message">{errors.adminCode}</span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card register">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join Event Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-control ${errors.firstName ? 'error' : ''}`}
                  placeholder="Enter first name"
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
                  className={`form-control ${errors.lastName ? 'error' : ''}`}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">Register As</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-control"
              >
                <option value="user">User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {renderRoleSpecificFields()}

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control ${errors.password ? 'error' : ''}`}
                  placeholder="Create password"
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className={`btn-submit ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            {errors.submit && (
              <div className="error-message text-center mt-3">
                {errors.submit}
              </div>
            )}
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;