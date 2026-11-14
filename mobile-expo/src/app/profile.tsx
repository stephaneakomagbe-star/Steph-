import { Redirect } from 'expo-router';
import { Alert } from 'react-native';
import { LoadingScreen, MainShell, ProfileScreen } from '../components';
import { useFaithLingo } from '../context/AppContext';
import { cancelDailyReminder, scheduleDailyReminder } from '../services/reminders';

export default function ProfileRoute() {
  const { data, isReady, storageError, retryStorage, updateProfile } = useFaithLingo();
  if (!isReady) return <LoadingScreen error={storageError} onRetry={retryStorage} />;
  if (!data.profile) return <Redirect href="/" />;
  const profile = data.profile;

  return (
    <MainShell activeTab="profil">
      <ProfileScreen
        profile={profile}
        reminderEnabled={profile.reminderEnabled}
        xp={data.xp}
        streak={data.streak}
        onUpdate={updateProfile}
        onSetReminder={async (enabled) => {
          try {
            if (enabled) await scheduleDailyReminder(profile.reminderHour, profile.reminderMinute);
            else await cancelDailyReminder();
            updateProfile({ reminderEnabled: enabled });
          } catch (error) {
            Alert.alert('Rappel non modifié', error instanceof Error ? error.message : 'Impossible de modifier le rappel.');
          }
        }}
        onSetReminderTime={async (hour) => {
          try {
            if (profile.reminderEnabled) await scheduleDailyReminder(hour, 0);
            updateProfile({ reminderHour: hour, reminderMinute: 0 });
          } catch (error) {
            Alert.alert('Heure non modifiée', error instanceof Error ? error.message : 'Impossible de modifier l’heure du rappel.');
          }
        }}
      />
    </MainShell>
  );
}
