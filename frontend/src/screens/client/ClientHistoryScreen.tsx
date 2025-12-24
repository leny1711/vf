import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import api from '../../api/api';

const ClientHistoryScreen = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    setLoading(true);
    try {
      const data = await api.getMyMissions();
      const completed = data.filter((m: any) => m.status === 'COMPLETED');
      setMissions(completed);
    } catch (error) {
      console.error('Failed to load missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMission = ({ item }: any) => (
    <View style={styles.missionCard}>
      <Text style={styles.missionTitle}>{item.title}</Text>
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
      {item.rating && (
        <Text style={styles.rating}>⭐ Note: {item.rating.score}/5</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={missions}
        renderItem={renderMission}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMissions} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune mission terminée</Text>
          </View>
        }
        contentContainerStyle={missions.length === 0 ? styles.emptyList : styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 20,
  },
  missionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
  rating: {
    fontSize: 14,
    color: '#FFA500',
    marginTop: 8,
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
    fontSize: 18,
    color: '#999',
  },
});

export default ClientHistoryScreen;
