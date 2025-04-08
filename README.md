# CELERIS – Application mobile de gestion d'interventions

## Objectif
Celeris permet aux techniciens de créer et documenter leurs interventions terrain avec génération de rapports (photos, IA, signature) et export PDF.

## Technologies
- React Native (Expo)
- Node.js + Express (backend hébergé)
- Mariadb
- OpenAI (analyse IA)
- PDFKit

## Installation

### Prérequis
- Node.js installé
- Expo CLI (`npm install -g expo-cli`)
- Clé OpenAI

### Étapes
```bash
git clone https://github.com/SaillantNicolas/Celeris
cd Celeris
npm install
```

1. Ouvrir `config/apiConfig.js`
2. Remplacer la ligne par votre propre clé OpenAI :

```js
export const OPENAI_API_KEY = 'sk-...';
```

3. Lancer le projet :
```bash
npx expo start
```

Scanner le QR Code avec **Expo Go** sur votre smartphone.


## Backend
Déjà déployé et configuré — aucune action requise côté utilisateur.
