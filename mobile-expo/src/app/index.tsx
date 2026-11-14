import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { Onboarding, LoadingScreen, MainShell, PathMap } from '../components';
import { useFaithLingo } from '../context/AppContext';
import { scheduleDailyReminder } from '../services/reminders';

export default function PathRoute() {
  const router = useRouter();
  const { data, isReady, storageError, retryStorage, setProfile, updateProfile } = useFaithLingo();

  if (!isReady) return <LoadingScreen error={storageError} onRetry={retryStorage} />;
  if (!data.profile) {
    async function finishOnboarding(profile: Parameters<typeof setProfile>[0]) {
      if (profile.reminderEnabled) {
        try {
          await scheduleDailyReminder(profile.reminderHour, profile.reminderMinute);
        } catch (error) {
          Alert.alert('Rappel non activé', error instanceof Error ? error.message : 'Impossible d’activer le rappel.');
          setProfile({ ...profile, reminderEnabled: false });
          return;
        }
      }
      setProfile(profile);
    }
    return <Onboarding onFinish={finishOnboarding} />;
  }

  return (
    <MainShell activeTab="parcours">
      <PathMap
        course={data.profile.course}
        level={data.profile.level}
        dailyGoal={data.profile.dailyGoal}
        hearts={data.hearts}
        completedLessonIds={data.completedLessonIds}
        onCourseChange={(course) => updateProfile({ course })}
        onStart={(lesson, review) => router.push({
          pathname: '/lesson/[id]',
          params: { id: lesson.id, review: review ? 'true' : 'false' },
        })}
        onRead={(lesson) => router.push({ pathname: '/read/[id]', params: { id: lesson.id } })}
      />
    </MainShell>
  );
}
