import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { missionsAPI } from '../services/api';
import PaymentComponent from '../components/PaymentComponent';
import '../styles/MissionDetail.css';

const MissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mission, setMission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchMission();
  }, [id]);

  const fetchMission = async () => {
    try {
      setLoading(true);
      const response = await missionsAPI.getById(id!);
      setMission(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load mission');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      await missionsAPI.accept(id!);
      fetchMission();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to accept mission');
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await missionsAPI.updateStatus(id!, { status });
      fetchMission();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    fetchMission();
  };

  if (loading) {
    return <div className="loading">Loading mission details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!mission) {
    return <div className="loading">Mission not found</div>;
  }

  const isClient = user?.id === mission.clientId;
  const isProvider = user?.id === mission.providerId;
  const canAccept = user?.role === 'PROVIDER' && mission.status === 'PENDING' && !isProvider;
  const canPay = isClient && mission.status === 'COMPLETED' && !mission.payment;
  const canComplete = isProvider && mission.status === 'IN_PROGRESS';

  return (
    <div className="mission-detail-container">
      <div className="mission-detail-card">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back
        </button>

        <h1>Mission Details</h1>

        <div className="detail-section">
          <h2>Description</h2>
          <p>{mission.description}</p>
        </div>

        <div className="detail-section">
          <h2>Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Status:</span>
              <span className="value status-badge" style={{ 
                backgroundColor: 
                  mission.status === 'PENDING' ? '#ffa500' :
                  mission.status === 'ACCEPTED' ? '#4CAF50' :
                  mission.status === 'IN_PROGRESS' ? '#2196F3' :
                  mission.status === 'COMPLETED' ? '#00bcd4' : '#999'
              }}>
                {mission.status}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Price:</span>
              <span className="value">${mission.price}</span>
            </div>
            <div className="info-item">
              <span className="label">Address:</span>
              <span className="value">{mission.address}</span>
            </div>
            {mission.isUrgent && (
              <div className="info-item">
                <span className="urgent-badge">⚡ URGENT</span>
              </div>
            )}
          </div>
        </div>

        {mission.client && (
          <div className="detail-section">
            <h2>Client</h2>
            <p>{mission.client.firstName} {mission.client.lastName}</p>
            <p>{mission.client.email}</p>
          </div>
        )}

        {mission.provider && (
          <div className="detail-section">
            <h2>Provider</h2>
            <p>{mission.provider.firstName} {mission.provider.lastName}</p>
            <p>{mission.provider.email}</p>
          </div>
        )}

        <div className="actions-section">
          {canAccept && (
            <button onClick={handleAccept} className="btn-primary">
              Accept Mission
            </button>
          )}

          {isProvider && mission.status === 'ACCEPTED' && (
            <button 
              onClick={() => handleUpdateStatus('IN_PROGRESS')} 
              className="btn-primary"
            >
              Start Mission
            </button>
          )}

          {canComplete && (
            <button 
              onClick={() => handleUpdateStatus('COMPLETED')} 
              className="btn-success"
            >
              Mark as Completed
            </button>
          )}

          {canPay && !showPayment && (
            <button 
              onClick={() => setShowPayment(true)} 
              className="btn-primary"
            >
              Pay Now
            </button>
          )}
        </div>

        {showPayment && canPay && (
          <PaymentComponent
            missionId={mission.id}
            amount={mission.price}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPayment(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MissionDetail;
