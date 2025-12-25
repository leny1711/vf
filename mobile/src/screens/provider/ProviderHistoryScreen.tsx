import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import api from '../../api/api';

const ProviderHistoryScreen = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [missionsData, earningsData] = await Promise.all([
        api.getMyMissions(),
        api.getProviderEarnings(),
      ]);
      const completed = missionsData.filter((m: any) => m.status === 'COMPLETED');
      setMissions(completed);
      setEarnings(earningsData);
    } catch (error) {
      console.error('Failed to load data:', error);
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
        {item.client && (
          <Text style={styles.missionClient}>
            {item.client.firstName} {item.client.lastName}
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
      {earnings && (
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Gains totaux</Text>
          <Text style={styles.earningsValue}>
            {earnings.totalEarnings.toFixed(2)}€
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Missions terminées</Text>

      <FlatList
        data={missions}
        renderItem={renderMission}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune mission terminée</Text>
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
  earningsCard: {
    backgroundColor: '#4CAF50',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningsLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  earningsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
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
    color: '#4CAF50',
  },
  missionClient: {
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

export default ProviderHistoryScreen;
