export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const sendIrrigationReminder = (cropName: string, amount: string, schedule: string) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  new Notification('Recordatorio de Riego — AgroApp', {
    body: `${cropName}: Aplicar ${amount} de riego (${schedule})`,
    icon: '/icons/icon-192x192.svg',
    tag: `irrigation-${cropName}`,
    requireInteraction: true,
  });
};

export const sendWeatherAlert = (message: string, _severity?: 'info' | 'warning' | 'error') => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  new Notification('Alerta Agronómica — AgroApp', {
    body: message,
    icon: '/icons/icon-192x192.svg',
    tag: `weather-alert-${Date.now()}`,
  });
};

export const scheduleIrrigationNotifications = (
  crops: { name: string; irrigationSystem: string }[],
  weeklyNeeds: Record<string, number>
) => {
  requestNotificationPermission().then(granted => {
    if (!granted) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (const crop of crops) {
      const need = weeklyNeeds[crop.name] || 0;
      if (need <= 0) continue;

      let frequency: string;
      let nextHour: number;

      if (need > 35) {
        frequency = 'diario';
        nextHour = 6;
      } else if (need > 20) {
        frequency = 'cada 2 días';
        nextHour = 7;
      } else if (need > 10) {
        frequency = 'cada 3 días';
        nextHour = 8;
      } else {
        frequency = 'semanal';
        nextHour = 9;
      }

      if (currentHour >= nextHour - 1 && currentHour < nextHour + 1 && currentMinute < 5) {
        sendIrrigationReminder(crop.name, `${need.toFixed(1)} mm`, frequency);
      }
    }
  });
};
