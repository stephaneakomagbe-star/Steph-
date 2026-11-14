import { Redirect, useRouter } from 'expo-router';
import { LoadingScreen, MainShell, ReviewScreen } from '../components';
import { useFaithLingo } from '../context/AppContext';
import { getCourseLessons } from '../data/coursesData';

export default function ReviewRoute() {
  const router = useRouter();
  const { data, isReady, storageError, retryStorage } = useFaithLingo();
  if (!isReady) return <LoadingScreen error={storageError} onRetry={retryStorage} />;
  if (!data.profile) return <Redirect href="/" />;

  return (
    <MainShell activeTab="revisions">
      <ReviewScreen
        lessons={getCourseLessons(data.profile.course)}
        completedLessonIds={data.completedLessonIds}
        onRead={(lesson) => router.push({ pathname: '/read/[id]', params: { id: lesson.id } })}
        onReview={(lesson) => router.push({ pathname: '/lesson/[id]', params: { id: lesson.id, review: 'true' } })}
      />
    </MainShell>
  );
}
