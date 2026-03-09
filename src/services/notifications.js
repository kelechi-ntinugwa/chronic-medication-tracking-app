import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        // token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        // alert('Must use physical device for Push Notifications');
    }

    return token;
};

export const scheduleMedicationReminder = async (medName, date) => {
    // Schedule for 7 days before
    const pickupDate = new Date(date);
    const trigger7Days = new Date(pickupDate);
    trigger7Days.setDate(pickupDate.getDate() - 7);

    if (trigger7Days > new Date()) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Medication Pickup Reminder",
                body: `Your ${medName} pickup is in 7 days.`,
            },
            trigger: trigger7Days,
        });
    }

    // Schedule for 3 days before
    const trigger3Days = new Date(pickupDate);
    trigger3Days.setDate(pickupDate.getDate() - 3);

    if (trigger3Days > new Date()) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Medication Pickup Reminder",
                body: `Your ${medName} pickup is in 3 days.`,
            },
            trigger: trigger3Days,
        });
    }

    // Schedule for On the day
    const triggerDay = new Date(pickupDate);
    triggerDay.setHours(9, 0, 0); // 9 AM

    if (triggerDay > new Date()) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Medication Pickup Today",
                body: `Don't forget to collect your ${medName} today!`,
            },
            trigger: triggerDay,
        });
    }
};

export const scheduleDailyDoseReminder = async (medName, timeOfDay, dosage) => {
    // timeOfDay e.g., "09:00" or Date object
    let triggerHour = 9;
    let triggerMinute = 0;

    if (timeOfDay instanceof Date) {
        triggerHour = timeOfDay.getHours();
        triggerMinute = timeOfDay.getMinutes();
    } else if (typeof timeOfDay === 'string' && timeOfDay.includes(':')) {
        const parts = timeOfDay.split(':');
        triggerHour = parseInt(parts[0], 10);
        triggerMinute = parseInt(parts[1], 10);
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: `Time for your ${medName}`,
            body: `Don't forget to take your ${dosage} of ${medName}. Tap to log it!`,
            data: { type: 'daily_dose', medName: medName }
        },
        trigger: {
            hour: triggerHour,
            minute: triggerMinute,
            repeats: true,
        },
    });
};
