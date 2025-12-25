import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Marketplace</h1>
        <p className="hero-subtitle">
          Connect with service providers or offer your services
        </p>

        {!user ? (
          <div className="hero-actions">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        ) : (
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure Authentication</h3>
            <p>JWT-based authentication with encrypted passwords</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Geolocation</h3>
            <p>Find services near you with Google Maps integration</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Stripe Payments</h3>
            <p>Secure payment processing with Stripe</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Rating System</h3>
            <p>Rate and review service providers</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Real-time Chat</h3>
            <p>Communicate with clients and providers</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics</h3>
            <p>Track your earnings and mission history</p>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <p>&copy; 2024 Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
