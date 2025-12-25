import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

const MissionDetailScreen = ({ route, navigation }: any) => {
  const { missionId } = route.params;
  const { user } = useAuth();
  const [mission, setMission] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadMissionDetails();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadMissionDetails = async () => {
    try {
      const data = await api.getMissionById(missionId);
      setMission(data);
      await loadMessages();
    } catch (error) {
      console.error('Failed to load mission:', error);
      Alert.alert('Erreur', 'Impossible de charger la mission');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const data = await api.getMessages(missionId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !mission) return;

    const receiverId =
      user?.role === 'CLIENT' ? mission.providerId : mission.clientId;

    if (!receiverId) {
      Alert.alert('Erreur', 'Aucun destinataire disponible');
      return;
    }

    setSendingMessage(true);
    try {
      await api.sendMessage(missionId, receiverId, newMessage);
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'envoi du message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await api.updateMissionStatus(missionId, status);
      await loadMissionDetails();
      Alert.alert('Succès', 'Statut mis à jour');
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.error || 'Échec de la mise à jour');
    }
  };

  const handleRateMission = () => {
    Alert.prompt(
      'Noter le prestataire',
      'Note sur 5',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Envoyer',
          onPress: async (score) => {
            const scoreNumber = parseInt(score || '0');
            if (scoreNumber < 1 || scoreNumber > 5) {
              Alert.alert('Erreur', 'Note invalide (1-5)');
              return;
            }
            try {
              await api.createRating({ missionId, score: scoreNumber });
              Alert.alert('Succès', 'Note envoyée');
              await loadMissionDetails();
            } catch (error: any) {
              Alert.alert('Erreur', error.response?.data?.error || 'Échec');
            }
          },
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!mission) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Mission introuvable</Text>
      </View>
    );
  }

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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>{mission.title}</Text>
          <Text style={[styles.status, { color: getStatusColor(mission.status) }]}>
            {mission.status}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{mission.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails</Text>
          <Text style={styles.detail}>📍 {mission.address}</Text>
          <Text style={styles.detail}>💰 {mission.price}€</Text>
        </View>

        {mission.client && user?.role === 'PROVIDER' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client</Text>
            <Text style={styles.detail}>
              {mission.client.firstName} {mission.client.lastName}
            </Text>
            {mission.client.phone && <Text style={styles.detail}>{mission.client.phone}</Text>}
          </View>
        )}

        {mission.provider && user?.role === 'CLIENT' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prestataire</Text>
            <Text style={styles.detail}>
              {mission.provider.firstName} {mission.provider.lastName}
            </Text>
            {mission.provider.phone && <Text style={styles.detail}>{mission.provider.phone}</Text>}
          </View>
        )}

        {user?.role === 'PROVIDER' && mission.status === 'ACCEPTED' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus('IN_PROGRESS')}
          >
            <Text style={styles.actionButtonText}>Démarrer la mission</Text>
          </TouchableOpacity>
        )}

        {user?.role === 'PROVIDER' && mission.status === 'IN_PROGRESS' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleUpdateStatus('COMPLETED')}
          >
            <Text style={styles.actionButtonText}>Terminer la mission</Text>
          </TouchableOpacity>
        )}

        {user?.role === 'CLIENT' &&
          mission.status === 'COMPLETED' &&
          !mission.rating && (
            <TouchableOpacity style={styles.actionButton} onPress={handleRateMission}>
              <Text style={styles.actionButtonText}>Noter le prestataire</Text>
            </TouchableOpacity>
          )}

        {mission.provider && (
          <View style={styles.chatSection}>
            <Text style={styles.sectionTitle}>Messages</Text>
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageContainer,
                    item.senderId === user?.id
                      ? styles.myMessage
                      : styles.otherMessage,
                  ]}
                >
                  <Text style={styles.messageSender}>
                    {item.sender.firstName} {item.sender.lastName}
                  </Text>
                  <Text style={styles.messageText}>{item.content}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>

      {mission.provider && mission.status !== 'COMPLETED' && mission.status !== 'CANCELLED' && (
        <View style={styles.chatInput}>
          <TextInput
            style={styles.input}
            placeholder="Écrire un message..."
            value={newMessage}
            onChangeText={setNewMessage}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={sendingMessage}
          >
            {sendingMessage ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Envoyer</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  detail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatSection: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: '#666',
  },
  messageText: {
    fontSize: 16,
  },
  chatInput: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default MissionDetailScreen;
