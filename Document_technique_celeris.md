### CELERIS – Gestion d’Interventions & Rapports

#### Objectif de l’application

Celeris est une application mobile conçue pour les techniciens d’intervention. Elle permet :

- La création, la planification et la gestion des interventions chez les clients.
- La génération de rapports complets avec :
  - Analyse automatique des photos via l’IA (OpenAI),
  - Signature du client,
  - Export en PDF.

---

### Fonctionnalités principales

- **Authentification sécurisée** (JWT)
- **Création d’interventions** avec date, statut, description
- **Rapports d’intervention** complets :
  - Texte libre ou généré via IA
  - Ajout de photos (problème/réparation)
  - Signature du client
- **Liste des interventions / rapports**
- **Téléchargement de rapport au format PDF**
- **Profil utilisateur & tableau de bord**

---

### Plateforme utilisée

- Application **mobile** (React Native avec Expo)
- Backend **déployé sur un serveur distant** (Node.js + MySQL)

---

### Environnement de test

Le backend est **déjà hébergé**. Seul le **frontend React Native** doit être lancé par l’utilisateur.

---

### Instructions d'installation

#### Prérequis

- Avoir **Node.js ≥ 16**
- Installer **Expo CLI** :
  ```bash
  npm install -g expo-cli
  ```

---

#### Étapes à suivre

1. **Cloner le projet** :

   ```bash
   git clone https://github.com/SaillantNicolas/Celeris
   cd Celeris
   ```

2. **Installer les dépendances** :

   ```bash
   npm install
   ```

3. **Configurer la clé OpenAI** :\
   Ouvrir le fichier `config/apiConfig.js` et **remplacer la clé par la vôtre** :

   ```js
   export const OPENAI_API_KEY = 'votre-clé-API-OpenAI-ici';
   ```

4. **Lancer le projet avec Expo** :

   ```bash
   npx expo start
   ```

5. Scanner le QR Code avec l’appli **Expo Go** sur mobile.

---

### 📍 Remarques

- Le backend est déjà connecté à la base de données distante.
- La clé OpenAI est **nécessaire uniquement pour les fonctions d’analyse IA**.

---

## ✅ Lien du projet (POC)

➡️ [**https://github.com/SaillantNicolas/Celeris**]

## 📌 Fichier inclus

- `README.md` dans le repo (installation rapide)
- `Document_technique_celeris.md` (ce fichier)

