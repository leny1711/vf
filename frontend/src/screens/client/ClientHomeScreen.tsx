import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

const ClientHomeScreen = ({ navigation }: any) => {
  const { user, logout } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    setLoading(true);
    try {
      const data = await api.getMyMissions();
      setMissions(data);
    } catch (error) {
      console.error('Failed to load missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#FFA500';
      case 'ACCEPTED':
        return '#4CAF50';
      case 'IN_PROGRESS':
        return '#2196F3';
      case 'COMPLETED':
        return '#4CAF50';
      case 'CANCELLED':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'ACCEPTED':
        return 'Acceptée';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'COMPLETED':
        return 'Terminée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', onPress: logout },
    ]);
  };

  const renderMission = ({ item }: any) => (
    <TouchableOpacity
      style={styles.missionCard}
      onPress={() => navigation.navigate('MissionDetail', { missionId: item.id })}
    >
      <View style={styles.missionHeader}>
        <Text style={styles.missionTitle}>{item.title}</Text>
        <Text style={[styles.missionStatus, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
      <Text style={styles.missionDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.missionFooter}>
        <Text style={styles.missionPrice}>{item.price}€</Text>
        {item.provider && (
          <Text style={styles.missionProvider}>
            {item.provider.firstName} {item.provider.lastName}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Mes missions</Text>

      <FlatList
        data={missions}
        renderItem={renderMission}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMissions} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune mission</Text>
            <Text style={styles.emptySubText}>
              Créez votre première mission pour commencer
            </Text>
          </View>
        }
        contentContainerStyle={missions.length === 0 ? styles.emptyList : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  logoutText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
  },
  missionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  missionStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  missionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  missionProvider: {
    fontSize: 14,
    color: '#666',
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default ClientHomeScreen;
