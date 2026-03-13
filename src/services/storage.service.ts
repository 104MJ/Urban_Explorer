import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PROFILE_PHOTO: 'urban_explorer_profile_photo',
  PLANNED_VISITS: 'urban_explorer_planned_visits',
};

export interface PlannedVisit {
  id: string;
  eventId: string; // ID from Expo Calendar
  eventTitle: string;
  date: string;
}

export const StorageService = {
  // --- Profile Photo ---
  saveProfilePhoto: async (uri: string | null) => {
    try {
      if (uri) {
        await AsyncStorage.setItem(KEYS.PROFILE_PHOTO, uri);
      } else {
        await AsyncStorage.removeItem(KEYS.PROFILE_PHOTO);
      }
    } catch (error) {
      console.error('Error saving profile photo:', error);
    }
  },

  loadProfilePhoto: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(KEYS.PROFILE_PHOTO);
    } catch (error) {
      console.error('Error loading profile photo:', error);
      return null;
    }
  },

  // --- Planned Visits ---
  savePlannedVisit: async (visit: PlannedVisit) => {
    try {
      const existingVisits = await StorageService.loadPlannedVisits();
      const updatedVisits = [...existingVisits, visit];
      await AsyncStorage.setItem(KEYS.PLANNED_VISITS, JSON.stringify(updatedVisits));
    } catch (error) {
      console.error('Error saving planned visit:', error);
    }
  },

  loadPlannedVisits: async (): Promise<PlannedVisit[]> => {
    try {
      const visitsJson = await AsyncStorage.getItem(KEYS.PLANNED_VISITS);
      return visitsJson ? JSON.parse(visitsJson) : [];
    } catch (error) {
      console.error('Error loading planned visits:', error);
      return [];
    }
  },
};
