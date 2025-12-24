import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

const AdminDashboardScreen = () => {
  const { logout } = useAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      Alert.alert('Erreur', 'Impossible de charger le tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', onPress: logout },
    ]);
  };

  if (!dashboard) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadDashboard} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Tableau de bord Admin</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utilisateurs</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboard.users.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboard.users.clients}</Text>
            <Text style={styles.statLabel}>Clients</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboard.users.providers}</Text>
            <Text style={styles.statLabel}>Prestataires</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {dashboard.users.availableProviders}
            </Text>
            <Text style={styles.statLabel}>Disponibles</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Missions</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboard.missions.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboard.missions.pending}</Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboard.missions.active}</Text>
            <Text style={styles.statLabel}>Actives</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboard.missions.completed}</Text>
            <Text style={styles.statLabel}>Terminées</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenus</Text>
        <View style={styles.revenueCard}>
          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Total</Text>
            <Text style={styles.revenueValue}>
              {dashboard.revenue.total.toFixed(2)}€
            </Text>
          </View>
          <View style={styles.revenueItem}>
            <Text style={styles.revenueLabel}>Commission plateforme</Text>
            <Text style={[styles.revenueValue, styles.platformRevenue]}>
              {dashboard.revenue.platform.toFixed(2)}€
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  title: {
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  revenueCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  revenueItem: {
    marginBottom: 15,
  },
  revenueLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  revenueValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  platformRevenue: {
    color: '#007AFF',
  },
});

export default AdminDashboardScreen;
