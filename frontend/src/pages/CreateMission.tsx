import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { missionsAPI } from '../services/api';
import '../styles/CreateMission.css';

const CreateMission: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: '',
    address: '',
    price: '',
    isUrgent: false,
    latitude: 0,
    longitude: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const missionData = {
        ...formData,
        price: parseFloat(formData.price),
      };

      await missionsAPI.create(missionData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create mission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-mission-container">
      <div className="create-mission-card">
        <h1>Create New Mission</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the service you need..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="123 Main St, City, Country"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
              placeholder="50.00"
            />
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="isUrgent"
                checked={formData.isUrgent}
                onChange={handleChange}
              />
              <span>Mark as Urgent</span>
            </label>
          </div>

          <div className="form-info">
            <p>📍 Your location will be automatically detected</p>
            <p>Current coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Mission'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMission;
