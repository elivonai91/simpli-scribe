export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const scheduleSubscriptionReminders = (subscription: Subscription) => {
  const now = new Date();
  const billingDate = new Date(subscription.nextBillingDate);
  
  // Calculate reminder times
  const fortyEightHourReminder = new Date(billingDate);
  fortyEightHourReminder.setHours(billingDate.getHours() - 48);
  
  const twentyFourHourReminder = new Date(billingDate);
  twentyFourHourReminder.setHours(billingDate.getHours() - 24);
  
  if (subscription.reminders.fortyEightHour && fortyEightHourReminder > now) {
    const timeDiff = fortyEightHourReminder.getTime() - now.getTime();
    setTimeout(() => {
      new Notification(`Subscription Reminder: ${subscription.name}`, {
        body: `Your subscription for ${subscription.name} will be charged in 48 hours. Amount: $${subscription.cost}`,
      });
    }, timeDiff);
  }
  
  if (subscription.reminders.twentyFourHour && twentyFourHourReminder > now) {
    const timeDiff = twentyFourHourReminder.getTime() - now.getTime();
    setTimeout(() => {
      new Notification(`Subscription Reminder: ${subscription.name}`, {
        body: `Your subscription for ${subscription.name} will be charged in 24 hours. Amount: $${subscription.cost}`,
      });
    }, timeDiff);
  }
};