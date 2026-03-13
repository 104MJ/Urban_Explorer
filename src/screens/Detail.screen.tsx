import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, Share, Modal, FlatList, Alert, } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from "@react-navigation/native";
import { DetailScreenRouteProp } from "../types/navigation";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as Calendar from "expo-calendar";
import { StorageService } from "../services/storage.service";

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { event } = route.params;

  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [durationHours, setDurationHours] = useState(2);
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState(15);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const availableCalendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        // Filtrer pour ne garder que les calendriers modifiables
        const modifiableCalendars = availableCalendars.filter(cal => cal.allowsModifications);
        setCalendars(modifiableCalendars);
        if (modifiableCalendars.length > 0) {
          setSelectedCalendarId(modifiableCalendars[0].id);
        }
      }
    })();
  }, []);

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, "").trim();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez cet événement : ${event.title}\nPlus d'infos ici : ${event.contact_url || "Urban Explorer"}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const onStartPlanning = () => {
    setTempDate(new Date(date));
    setShowDatePicker(true);
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const confirmDate = () => {
    const newDate = new Date(date);
    newDate.setFullYear(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
    setDate(newDate);
    setTempDate(new Date(newDate));
    setShowDatePicker(false);
    setShowTimePicker(true);
  };

  const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (selectedTime) {
      setTempDate(selectedTime);
    }
  };

  const confirmTime = () => {
    const newDate = new Date(date);
    newDate.setHours(tempDate.getHours(), tempDate.getMinutes());
    setDate(newDate);

    // Calculer l'heure de fin pour l'aperçu si besoin (optionnel, supprimé pour simplification)

    setShowTimePicker(false);
    setShowCalendarModal(true);
  };

  const createEvent = async () => {
    if (!selectedCalendarId) {
      Alert.alert("Erreur", "Veuillez sélectionner un calendrier.");
      return;
    }

    try {
      const finalEndDate = new Date(date);
      finalEndDate.setHours(finalEndDate.getHours() + durationHours);

      const eventId = await Calendar.createEventAsync(selectedCalendarId, {
        title: `Visite : ${event.title}`,
        startDate: date,
        endDate: finalEndDate,
        location: event.address_name,
        notes: event.description,
        alarms: reminderMinutes > 0 ? [{ relativeOffset: -reminderMinutes }] : [],
      });

      if (eventId) {
        Alert.alert(
          "Succès",
          `Visite au "${event.title}" planifiée le ${date.toLocaleDateString()} à ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} !`
        );

        await StorageService.savePlannedVisit({
          id: event.id.toString(),
          eventId,
          eventTitle: event.title,
          date: date.toISOString(),
        });

        setShowCalendarModal(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de créer l'événement.");
    }
  };

  const cleanDescription = stripHtml(event.description || "");
  const shouldTruncate = cleanDescription.length > 200;
  const displayedDescription = shouldTruncate && !isExpanded
    ? cleanDescription.substring(0, 200) + "..."
    : cleanDescription;

  // Calculer la date minimale (début d'aujourd'hui)
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false}>
        <Image source={{ uri: event.cover_url }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.category}>{event.qfap_tags?.split(";")[0]}</Text>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Date et Horaire</Text>
            <Text style={styles.text}>{stripHtml(event.date_description || "")}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Lieu</Text>
            <Text style={styles.placeName}>{event.address_name}</Text>
            <Text style={styles.text}>
              {event.address_street}, {event.address_zipcode}{" "}
              {event.address_city}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ À propos</Text>
            <Text style={styles.description}>{displayedDescription}</Text>
            {shouldTruncate && (
              <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>{isExpanded ? "Voir moins" : "Voir plus"}</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={onStartPlanning}
          >
            <Text style={styles.buttonText}>Planifier ma visite</Text>
          </TouchableOpacity>

          {event.contact_url && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => openUrl(event.contact_url)}
            >
              <Text style={styles.secondaryButtonText}>Voir le site officiel</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.secondaryButton, { borderStyle: "dashed" }]} onPress={handleShare}>
            <Text style={styles.secondaryButtonText}>Partager</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal pour le Date Picker */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <Text style={styles.modalTitle}>Choisir une date</Text>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={onChangeDate}
              minimumDate={minDate}
              textColor="#000"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDate}
              >
                <Text style={styles.confirmButtonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal pour le Time Picker */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <Text style={styles.modalTitle}>Heure de début</Text>
            <DateTimePicker
              value={tempDate}
              mode="time"
              display="spinner"
              onChange={onChangeTime}
              textColor="#000"
            />

            <View style={styles.durationContainer}>
              <Text style={styles.durationTitle}>Durée de la visite</Text>
              <View style={styles.durationOptions}>
                {[1, 2, 3, 4, 5].map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={[
                      styles.durationChip,
                      durationHours === h && styles.selectedDurationChip
                    ]}
                    onPress={() => setDurationHours(h)}
                  >
                    <Text style={[
                      styles.durationText,
                      durationHours === h && styles.selectedDurationText
                    ]}>
                      {h}h
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmTime}
              >
                <Text style={styles.confirmButtonText}>Valider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCalendarModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Dernière étape</Text>
              <Text style={styles.modalSubtitle}>Choisis un calendrier et un rappel</Text>
            </View>

            <View style={styles.reminderContainer}>
              <Text style={styles.sectionTitleSmall}>⏰ Rappel</Text>
              <View style={styles.reminderOptions}>
                {[0, 15, 30, 60].map((mins) => (
                  <TouchableOpacity
                    key={mins}
                    style={[
                      styles.reminderChip,
                      reminderMinutes === mins && styles.selectedReminderChip
                    ]}
                    onPress={() => setReminderMinutes(mins)}
                  >
                    <Text style={[
                      styles.reminderText,
                      reminderMinutes === mins && styles.selectedReminderText
                    ]}>
                      {mins === 0 ? "Aucun" : mins === 60 ? "1h" : `${mins}m`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitleSmall}>📅 Calendrier</Text>
            <FlatList
              data={calendars}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.calendarItem,
                    selectedCalendarId === item.id && styles.selectedCalendarItem,
                  ]}
                  onPress={() => setSelectedCalendarId(item.id)}
                >
                  <View style={[styles.calendarColor, { backgroundColor: item.color }]} />
                  <View style={styles.calendarInfo}>
                    <Text style={styles.calendarName}>{item.title}</Text>
                    <Text style={styles.calendarAccount}>{item.source.name}</Text>
                  </View>
                  {selectedCalendarId === item.id && (
                    <View style={styles.checkCircle}>
                      <Text style={styles.checkIcon}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowCalendarModal(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={createEvent}
              >
                <Text style={styles.confirmButtonText}>Confirmer la visite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 20,
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  category: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  placeName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 26,
    textAlign: "justify",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#E5E5EA",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: "#3A3A3C",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  pickerContainer: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingTop: 12,
    maxHeight: "80%",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E5E5EA",
    borderRadius: 2.5,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    textAlign: "center",
  },
  calendarItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCalendarItem: {
    backgroundColor: "#EBF5FF",
    borderColor: "#007AFF",
  },
  calendarColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  calendarInfo: {
    flex: 1,
  },
  calendarName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  calendarAccount: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkIcon: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingBottom: 20,
  },
  modalButton: {
    flex: 0.47,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F2F2F7",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  modalButtonText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#3A3A3C",
  },
  confirmButtonText: {
    fontWeight: "700",
    fontSize: 16,
    color: "#fff",
  },
  readMoreButton: {
    marginTop: 8,
  },
  readMoreText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "700",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  reminderContainer: {
    marginBottom: 20,
    backgroundColor: "#F2F2F7",
    padding: 16,
    borderRadius: 16,
  },
  reminderOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reminderChip: {
    flex: 0.23,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  selectedReminderChip: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  reminderText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3A3A3C",
  },
  selectedReminderText: {
    color: "#fff",
  },
  durationContainer: {
    width: "100%",
    marginVertical: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  durationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
  durationOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  durationChip: {
    flex: 0.18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  selectedDurationChip: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  durationText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3A3A3C",
  },
  selectedDurationText: {
    color: "#fff",
  },
});

export default DetailScreen;
