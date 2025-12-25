import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  FlatList,
  RefreshControl,
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

const ProviderHomeScreen = ({ navigation }: any) => {
  const { user, logout, refreshProfile } = useAuth();
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable || false);
  const [nearbyMissions, setNearbyMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    requestLocationPermission();
    loadStats();
  }, []);

  useEffect(() => {
    if (isAvailable) {
      loadNearbyMissions();
      const interval = setInterval(loadNearbyMissions, 10000);
      return () => clearInterval(interval);
    }
  }, [isAvailable]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      updateLocation();
    }
  };

  const updateLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      await api.updateLocation(
        location.coords.latitude,
        location.coords.longitude
      );
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadNearbyMissions = async () => {
    setLoading(true);
    try {
      const data = await api.getNearbyMissions(10);
      setNearbyMissions(data);
    } catch (error) {
      console.error('Failed to load missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (value: boolean) => {
    try {
      await api.toggleAvailability(value);
      setIsAvailable(value);
      await refreshProfile();
      if (value) {
        await updateLocation();
        await loadNearbyMissions();
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de changer la disponibilité');
    }
  };

  const handleAcceptMission = async (missionId: string) => {
    Alert.alert('Accepter la mission', 'Voulez-vous accepter cette mission ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Accepter',
        onPress: async () => {
          try {
            await api.acceptMission(missionId);
            Alert.alert('Succès', 'Mission acceptée');
            await loadNearbyMissions();
            navigation.navigate('Missions');
          } catch (error: any) {
            Alert.alert(
              'Erreur',
              error.response?.data?.error || 'Échec de l\'acceptation'
            );
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', onPress: logout },
    ]);
  };

  const renderMission = ({ item }: any) => (
    <View style={styles.missionCard}>
      <View style={styles.missionHeader}>
        <Text style={styles.missionTitle}>{item.title}</Text>
        <Text style={styles.missionDistance}>{item.distance} km</Text>
      </View>
      <Text style={styles.missionDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <Text style={styles.missionAddress}>📍 {item.address}</Text>
      <View style={styles.missionFooter}>
        <Text style={styles.missionPrice}>{item.price}€</Text>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAcceptMission(item.id)}
        >
          <Text style={styles.acceptButtonText}>Accepter</Text>
        </TouchableOpacity>
      </View>
    </View>
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

      {stats && (
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.completedMissions}</Text>
            <Text style={styles.statLabel}>Missions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalEarnings.toFixed(2)}€</Text>
            <Text style={styles.statLabel}>Gains</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.averageRating.toFixed(1)}⭐</Text>
            <Text style={styles.statLabel}>Note</Text>
          </View>
        </View>
      )}

      <View style={styles.availabilityCard}>
        <Text style={styles.availabilityLabel}>Disponible pour missions</Text>
        <Switch value={isAvailable} onValueChange={toggleAvailability} />
      </View>

      {isAvailable ? (
        <>
          <Text style={styles.sectionTitle}>Missions à proximité</Text>
          <FlatList
            data={nearbyMissions}
            renderItem={renderMission}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={loadNearbyMissions} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Aucune mission disponible</Text>
              </View>
            }
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Activez votre disponibilité</Text>
          <Text style={styles.emptySubText}>
            pour voir les missions à proximité
          </Text>
        </View>
      )}
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
  statsCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  availabilityCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  availabilityLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
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
  missionDistance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  missionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  missionAddress: {
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
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

export default ProviderHomeScreen;
