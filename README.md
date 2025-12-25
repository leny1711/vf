# Marketplace - Application de Services à la Demande

Application full-stack complète de place de marché de services humains (type "Uber des tâches du quotidien") avec interface Web et Mobile.

## 🏗️ Architecture

### Backend
- **Framework**: Node.js + Express + TypeScript
- **ORM**: Prisma
- **Base de données**: PostgreSQL
- **Authentification**: JWT + bcrypt
- **Paiements**: Stripe
- **Géolocalisation**: Google Maps API

### Frontend Web
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Routing**: React Router
- **HTTP Client**: Axios
- **Paiements**: Stripe React Components
- **Cartes**: Google Maps JavaScript API

### Mobile
- **Framework**: React Native (Expo SDK 54.0.0)
- **Language**: TypeScript
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **Cartes**: React Native Maps

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v15 ou supérieur) **OU** Docker
- npm (v9.x)
- Expo CLI (`npm install -g expo-cli`) - pour l'application mobile
- Compte Stripe (pour les paiements)
- Clé API Google Maps

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd vf
```

### 2. Démarrer PostgreSQL

**Option A: Avec Docker (recommandé)**
```bash
docker-compose up -d
```

**Option B: Installation locale**
- Installer PostgreSQL 15
- Créer une base de données `marketplace_db`

### 3. Configuration Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier le .env avec vos configurations
# DATABASE_URL=postgresql://marketplace:marketplace123@localhost:5432/marketplace_db
# JWT_SECRET=your-secret-key
# STRIPE_SECRET_KEY=your-stripe-key
# GOOGLE_MAPS_API_KEY=your-google-maps-key

# Générer le client Prisma
npx prisma generate

# Créer la base de données et exécuter les migrations
npx prisma migrate dev --name init

# Démarrer le serveur de développement
npm run dev
```

Le backend sera accessible sur `http://localhost:3000`

### 4. Configuration Frontend Web

```bash
cd ../frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier le .env avec vos configurations
# VITE_API_URL=http://localhost:3000/api
# VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
# VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

# Démarrer le serveur de développement
npm run dev
```

Le frontend web sera accessible sur `http://localhost:5173`

### 5. Configuration Mobile

```bash
cd ../mobile

# Installer les dépendances
npm install

# Créer un fichier .env
cp .env.example .env

# Modifier le .env
# EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:3000/api
# Remplacer YOUR_LOCAL_IP par votre adresse IP locale (ex: 192.168.1.100)

# Démarrer l'application
npm start
```

Scannez le QR code avec l'application Expo Go sur votre smartphone.

## 🗄️ Base de données

### Modèles Prisma

- **User**: Utilisateurs (CLIENT, PROVIDER, ADMIN)
- **Mission**: Missions/tâches
- **Payment**: Paiements Stripe
- **Rating**: Notes et avis
- **Message**: Messages de chat

### Commandes utiles

```bash
# Ouvrir Prisma Studio (interface graphique)
npx prisma studio

# Créer une nouvelle migration
npx prisma migrate dev --name nom_migration

# Réinitialiser la base de données
npx prisma migrate reset
```

## 📱 Fonctionnalités

### Client
- ✅ Inscription / Connexion
- ✅ Création de mission
- ✅ Géolocalisation automatique
- ✅ Suivi du statut de la mission
- ✅ Chat avec le prestataire
- ✅ Paiement Stripe
- ✅ Historique des missions
- ✅ Notation du prestataire

### Prestataire
- ✅ Inscription / Connexion
- ✅ Activation/désactivation disponibilité
- ✅ Missions à proximité (GPS)
- ✅ Acceptation/refus de missions
- ✅ Chat avec le client
- ✅ Historique des gains
- ✅ Statistiques

### Admin
- ✅ Tableau de bord
- ✅ Gestion utilisateurs
- ✅ Gestion missions
- ✅ Vue paiements
- ✅ Statistiques plateforme

## 🔐 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur

### Utilisateurs
- `PUT /api/users/location` - Mise à jour localisation
- `PUT /api/users/availability` - Disponibilité
- `GET /api/users/stats` - Statistiques

### Missions
- `POST /api/missions` - Créer mission
- `GET /api/missions/:id` - Détails mission
- `GET /api/missions/nearby` - Missions à proximité
- `GET /api/missions/my-missions` - Mes missions
- `POST /api/missions/:id/accept` - Accepter mission
- `PUT /api/missions/:id/status` - Mettre à jour statut
- `POST /api/missions/:id/messages` - Envoyer message
- `GET /api/missions/:id/messages` - Récupérer messages

### Paiements
- `POST /api/payments/create-intent` - Créer paiement
- `POST /api/payments/confirm` - Confirmer paiement
- `GET /api/payments/mission/:missionId` - Paiement par mission
- `GET /api/payments/earnings` - Gains prestataire

### Notes
- `POST /api/ratings` - Créer note
- `GET /api/ratings/provider/:providerId` - Notes prestataire
- `GET /api/ratings/mission/:missionId` - Note par mission

### Admin
- `GET /api/admin/dashboard` - Tableau de bord
- `GET /api/admin/users` - Liste utilisateurs
- `GET /api/admin/missions` - Liste missions
- `GET /api/admin/payments` - Liste paiements
- `PUT /api/admin/users/:userId/block` - Bloquer/débloquer
- `DELETE /api/admin/users/:userId` - Supprimer utilisateur

## 🔧 Configuration

### Variables d'environnement Backend

```env
DATABASE_URL=postgresql://marketplace:marketplace123@localhost:5432/marketplace_db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
PLATFORM_COMMISSION_RATE=0.15
PORT=3000
NODE_ENV=development
```

### Variables d'environnement Frontend Web

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### Variables d'environnement Mobile

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
```

## 📦 Structure du projet

```
vf/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   ├── database.ts
│   │   │   ├── stripe.ts
│   │   │   └── googleMaps.ts
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── missions/
│   │   │   ├── payments/
│   │   │   ├── ratings/
│   │   │   └── admin/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CreateMission.tsx
│   │   │   └── MissionDetail.tsx
│   │   ├── components/
│   │   │   ├── MapComponent.tsx
│   │   │   ├── MissionList.tsx
│   │   │   └── PaymentComponent.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── styles/
│   │   └── ...
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── mobile/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── navigation/
│   │   │   └── AppNavigator.tsx
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   ├── client/
│   │   │   ├── provider/
│   │   │   └── admin/
│   │   └── ...
│   ├── App.tsx
│   ├── app.json
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🧪 Tests

Pour tester l'application :

1. Créer un compte CLIENT
2. Créer une mission
3. Créer un compte PROVIDER
4. Activer la disponibilité du provider
5. Accepter la mission
6. Compléter le workflow

## 🛠️ Développement

### Backend

```bash
cd backend
npm run dev  # Mode développement avec hot-reload
npm run build  # Compilation TypeScript
npm start  # Production
```

### Frontend Web

```bash
cd frontend
npm run dev  # Démarrer Vite dev server
npm run build  # Build production
npm run preview  # Preview build
```

### Mobile

```bash
cd mobile
npm start  # Démarrer Expo
npm run android  # Android
npm run ios  # iOS
```

## 🚀 Quick Start (Commandes simplifiées)

**Terminal 1 - PostgreSQL:**
```bash
docker-compose up -d
```

**Terminal 2 - Backend:**
```bash
cd backend && npm install && npx prisma generate && npx prisma migrate dev && npm run dev
```

**Terminal 3 - Frontend Web:**
```bash
cd frontend && npm install && npm run dev
```

**Terminal 4 - Mobile:**
```bash
cd mobile && npm install && npm start
```

## 🚫 Notes importantes

- ❌ **Pas de Firebase** - Notifications gérées en backend uniquement
- ❌ **Pas de FCM** - Push notifications non implémentées
- ✅ **Chat REST** - Polling toutes les 3 secondes
- ✅ **Commission** - 15% par défaut (configurable)
- ✅ **Géolocalisation** - Calcul distance Haversine

## 📄 Licence

ISC