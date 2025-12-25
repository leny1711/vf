import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
} from 'react-native';
import * as Location from 'expo-location';
import api from '../../api/api';

const CreateMissionScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Veuillez autoriser l\'accès à la localisation');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const addr = geocode[0];
        const fullAddress = `${addr.street || ''} ${addr.city || ''} ${addr.postalCode || ''}`.trim();
        setAddress(fullAddress);
      }
    } catch (error) {
      console.error('Failed to get location:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position');
    }
  };

  const handleCreateMission = async () => {
    if (!title || !description || !address || !price) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un prix valide');
      return;
    }

    setLoading(true);
    try {
      const mission = await api.createMission({
        title,
        description,
        address,
        price: priceNumber,
        urgent,
      });

      Alert.alert('Succès', 'Mission créée avec succès', [
        {
          text: 'OK',
          onPress: () => {
            setTitle('');
            setDescription('');
            setAddress('');
            setPrice('');
            setUrgent(false);
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.error || 'Échec de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nouvelle mission</Text>

      <TextInput
        style={styles.input}
        placeholder="Titre de la mission"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description détaillée"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <View style={styles.locationRow}>
        <TextInput
          style={[styles.input, styles.locationInput]}
          placeholder="Adresse"
          value={address}
          onChangeText={setAddress}
        />
        <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
          <Text style={styles.locationButtonText}>📍</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Prix (€)"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />

      <View style={styles.urgentRow}>
        <Text style={styles.urgentLabel}>Mission urgente</Text>
        <Switch value={urgent} onValueChange={setUrgent} />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCreateMission}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Créer la mission</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 15,
    textAlignVertical: 'top',
  },
  locationRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  locationInput: {
    flex: 1,
    marginBottom: 0,
  },
  locationButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: 24,
  },
  urgentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 10,
  },
  urgentLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CreateMissionScreen;
