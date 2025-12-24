# Guide de démarrage rapide

## 🚀 Installation rapide

### 1. Backend

```bash
cd backend

# Installation
npm install

# Configuration de la base de données PostgreSQL
# Assurez-vous que PostgreSQL est en cours d'exécution
# Créez une base de données nommée "marketplace_db"

# Créer le fichier .env
cp .env.example .env

# Modifiez le fichier .env avec vos informations :
# - DATABASE_URL avec vos identifiants PostgreSQL
# - JWT_SECRET avec une clé secrète sécurisée
# - STRIPE_SECRET_KEY avec votre clé Stripe
# - GOOGLE_MAPS_API_KEY avec votre clé Google Maps

# Initialiser la base de données
npx prisma generate
npx prisma migrate dev --name init

# Démarrer le serveur
npm run dev
```

Le backend est maintenant accessible sur http://localhost:3000

### 2. Frontend

```bash
cd frontend

# Installation
npm install

# Configuration
# Trouvez votre adresse IP locale :
# - Windows: ipconfig
# - Mac/Linux: ifconfig ou ip addr

# Créez le fichier .env
echo "EXPO_PUBLIC_API_URL=http://VOTRE_IP_LOCALE:3000/api" > .env
# Exemple: EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api

# Démarrer l'application
npm start
```

Scannez le QR code avec l'application Expo Go sur votre téléphone.

## 📱 Test de l'application

### Créer un compte Admin (via base de données)

```sql
-- Connectez-vous à PostgreSQL et exécutez :
UPDATE users SET role = 'ADMIN' WHERE email = 'votre@email.com';
```

### Workflow de test complet

1. **Créer un compte CLIENT**
   - Ouvrir l'app
   - S'inscrire en tant que CLIENT
   - Se connecter

2. **Créer une mission**
   - Aller dans "Nouvelle mission"
   - Remplir les informations
   - Utiliser le bouton 📍 pour la localisation automatique
   - Créer la mission

3. **Créer un compte PROVIDER**
   - Se déconnecter
   - S'inscrire en tant que PROVIDER
   - Se connecter

4. **Accepter la mission**
   - Activer la disponibilité
   - Voir les missions à proximité
   - Accepter la mission

5. **Compléter la mission**
   - Démarrer la mission (IN_PROGRESS)
   - Utiliser le chat pour communiquer
   - Terminer la mission (COMPLETED)

6. **Noter le prestataire**
   - Se connecter en tant que CLIENT
   - Ouvrir la mission terminée
   - Noter le prestataire (1-5)

## 🔧 Commandes utiles

### Backend
```bash
# Voir la base de données
npx prisma studio

# Réinitialiser la base
npx prisma migrate reset

# Générer le client Prisma après modification du schema
npx prisma generate
```

### Frontend
```bash
# Démarrer sur Android
npm run android

# Démarrer sur iOS
npm run ios

# Nettoyer le cache
expo start -c
```

## ⚠️ Problèmes courants

### Le frontend ne peut pas se connecter au backend
- Vérifiez que vous utilisez votre IP locale (pas localhost)
- Vérifiez que le backend est démarré
- Vérifiez que le firewall n'est pas activé

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est démarré
- Vérifiez les identifiants dans DATABASE_URL
- Vérifiez que la base de données existe

### Erreur Prisma
- Exécutez `npx prisma generate`
- Supprimez node_modules et réinstallez

### Erreur Expo
- Nettoyez le cache : `expo start -c`
- Supprimez le dossier .expo
- Réinstallez les dépendances

## 📞 Support

Pour toute question ou problème, consultez le README.md principal.
