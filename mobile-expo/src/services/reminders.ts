import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDER_KIND = 'faithlingo-daily-reminder';
const CHANNEL_ID = 'faithlingo-learning';

export async function scheduleDailyReminder(hour: number, minute: number): Promise<void> {
  if (Platform.OS === 'web') throw new Error('Les rappels sont disponibles dans l’application iOS ou Android.');

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Rappel quotidien FaithLingo',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const permission = await Notifications.getPermissionsAsync();
  const finalPermission = permission.status === 'granted'
    ? permission
    : await Notifications.requestPermissionsAsync();
  if (finalPermission.status !== 'granted') {
    throw new Error('Autorisez les notifications dans les réglages de votre téléphone pour activer ce rappel.');
  }

  const trigger: Notifications.NotificationTriggerInput = Platform.OS === 'android'
    ? {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    }
    : {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour,
      minute,
      repeats: true,
    };

  const newIdentifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Un moment pour vous',
      body: 'Votre petite leçon FaithLingo vous attend, quand vous le souhaitez.',
      data: { kind: REMINDER_KIND, url: '/' },
    },
    trigger,
  });

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(scheduled
    .filter((notification) => notification.content.data?.kind === REMINDER_KIND
      && notification.identifier !== newIdentifier)
    .map((notification) => Notifications.cancelScheduledNotificationAsync(notification.identifier)));
}

export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(scheduled
    .filter((notification) => notification.content.data?.kind === REMINDER_KIND)
    .map((notification) => Notifications.cancelScheduledNotificationAsync(notification.identifier)));
}
