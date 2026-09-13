import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleRevealDayNudge(memoryId: string, date: string, title: string) {
  const trigger = new Date(date);
  trigger.setHours(9, 0, 0, 0);
  if (trigger.getTime() <= Date.now()) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "today's the day",
      body: title,
      data: { memoryId },
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
  });
}
