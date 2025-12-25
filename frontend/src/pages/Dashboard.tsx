import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { missionsAPI, usersAPI } from '../services/api';
import MapComponent from '../components/MapComponent';
import MissionList from '../components/MissionList';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch missions based on role
      if (user?.role === 'PROVIDER') {
        const nearbyResponse = await missionsAPI.getNearby();
        setMissions(nearbyResponse.data);
      } else {
        const myMissionsResponse = await missionsAPI.getMyMissions({ role: user?.role });
        setMissions(myMissionsResponse.data);
      }

      // Fetch user stats
      const statsResponse = await usersAPI.getStats();
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateMission = () => {
    navigate('/create-mission');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Marketplace Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.firstName}!</span>
            <span className="role-badge">{user?.role}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Stats Section */}
        {stats && (
          <div className="stats-section">
            <div className="stat-card">
              <h3>Total Missions</h3>
              <p className="stat-value">{stats.totalMissions || 0}</p>
            </div>
            {user?.role === 'PROVIDER' && (
              <>
                <div className="stat-card">
                  <h3>Total Earnings</h3>
                  <p className="stat-value">${stats.totalEarnings || 0}</p>
                </div>
                <div className="stat-card">
                  <h3>Average Rating</h3>
                  <p className="stat-value">{stats.averageRating || 0} ⭐</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="actions-section">
          {user?.role === 'CLIENT' && (
            <button onClick={handleCreateMission} className="btn-primary">
              Create New Mission
            </button>
          )}
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2>Map View</h2>
          <MapComponent missions={missions} />
        </div>

        {/* Missions List */}
        <div className="missions-section">
          <h2>
            {user?.role === 'PROVIDER' ? 'Available Missions' : 'My Missions'}
          </h2>
          <MissionList missions={missions} onRefresh={fetchData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
