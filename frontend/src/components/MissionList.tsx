import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MissionList.css';

interface Mission {
  id: string;
  title?: string;
  description: string;
  status: string;
  price: number;
  isUrgent?: boolean;
  address?: string;
  createdAt: string;
  client?: {
    firstName: string;
    lastName: string;
  };
  provider?: {
    firstName: string;
    lastName: string;
  };
}

interface MissionListProps {
  missions: Mission[];
  onRefresh: () => void;
}

const MissionList: React.FC<MissionListProps> = ({ missions, onRefresh }) => {
  const navigate = useNavigate();

  const handleMissionClick = (missionId: string) => {
    navigate(`/mission/${missionId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#ffa500';
      case 'ACCEPTED':
        return '#4CAF50';
      case 'IN_PROGRESS':
        return '#2196F3';
      case 'COMPLETED':
        return '#00bcd4';
      case 'CANCELLED':
        return '#f44336';
      default:
        return '#999';
    }
  };

  if (missions.length === 0) {
    return (
      <div className="no-missions">
        <p>No missions available at the moment.</p>
        <button onClick={onRefresh} className="btn-secondary">Refresh</button>
      </div>
    );
  }

  return (
    <div className="mission-list">
      {missions.map((mission) => (
        <div
          key={mission.id}
          className="mission-card"
          onClick={() => handleMissionClick(mission.id)}
        >
          <div className="mission-header">
            <h3>{mission.title || mission.description.substring(0, 50)}</h3>
            {mission.isUrgent && <span className="urgent-badge">URGENT</span>}
          </div>

          <p className="mission-description">{mission.description}</p>

          {mission.address && (
            <p className="mission-address">📍 {mission.address}</p>
          )}

          <div className="mission-footer">
            <span className="mission-price">${mission.price}</span>
            <span
              className="mission-status"
              style={{ backgroundColor: getStatusColor(mission.status) }}
            >
              {mission.status}
            </span>
          </div>

          {mission.client && (
            <p className="mission-user">
              Client: {mission.client.firstName} {mission.client.lastName}
            </p>
          )}

          {mission.provider && (
            <p className="mission-user">
              Provider: {mission.provider.firstName} {mission.provider.lastName}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default MissionList;
