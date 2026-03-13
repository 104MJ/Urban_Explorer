# Urban Explorer

Urban Explorer est une application mobile de type City Guide développée avec React Native et Expo. Elle permet aux utilisateurs de découvrir des lieux d'intérêt à Paris, de visualiser leur emplacement sur une carte, de consulter les événements associés et d'immortaliser leur visite en photo.

## Fonctionnalités

- **Découverte** : Liste des événements culturels à Paris avec recherche et navigation vers le détail.
- **Carte** : Affichage des lieux sur une carte interactive avec marqueurs.
- **Mon Profil** : Prise de selfie souvenir et affichage de l'avatar utilisateur.

## Architecture

- **Navigation** : Bottom Tab Navigator (Découverte, Carte, Mon Profil) + Stack Navigator pour la navigation vers le détail d'un événement.
- **Dossiers** :
  - `src/screens/` : Écrans principaux de l'application
  - `src/components/` : Composants réutilisables (Carte, Caméra, etc.)
  - `src/services/` : Services pour l'API, gestion des images, etc.
  - `src/types/` : Types TypeScript

## Installation

1. **Cloner le dépôt**

   ```sh
   git clone <url-du-repo>
   cd urban_explorer
   ```

2. **Installer les dépendances**

   ```sh
   npm install
   ```

3. **Lancer l'application**
   ```sh
   npm start
   ```
   Puis scanner le QR code avec Expo Go ou lancer sur un simulateur.

## API utilisée

- [Open Data Paris - Que faire à Paris ?](https://opendata.paris.fr/explore/dataset/que-faire-a-paris-/api/)
- [Open Data Paris - Lieux culturels à Paris](https://opendata.paris.fr/explore/dataset/lieux-culturels-a-paris/api/)

## Dépendances principales

- React Native / Expo
- react-navigation
- react-native-maps
- expo-camera
- axios

## Fonctionnalités techniques

- Récupération et affichage des événements via l’API
- Carte interactive avec marqueurs pour chaque lieu
- Prise de photo avec permissions caméra
- Gestion des erreurs réseau et indicateur de chargement

## Captures d'écran

_Ajoute ici des captures d'écran de ton application_

## Auteur

Ton nom

---

N’hésite pas à adapter ce modèle selon tes besoins et à ajouter des sections (ex : Difficultés rencontrées, Bonus réalisés, etc.).
