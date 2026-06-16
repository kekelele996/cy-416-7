import { useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { BookingStatus } from '@/constants/booking';
import type { Booking } from '@/models/booking';
import { useBookingStore } from '@/stores/bookingStore';
import { useAuth } from '@/hooks/useAuth';

interface ReminderSchedulerOptions {
  onReminder: (booking: Booking) => void;
  checkIntervalMs?: number;
}

export function useReminderScheduler({ onReminder, checkIntervalMs = 30000 }: ReminderSchedulerOptions) {
  const bookings = useBookingStore((state) => state.bookings);
  const triggerReminder = useBookingStore((state) => state.triggerReminder);
  const { currentUser } = useAuth();
  const timerRef = useRef<number | null>(null);

  const checkReminders = () => {
    const now = dayjs();

    bookings.forEach((booking) => {
      if (booking.user_id !== currentUser?.id && !booking.attendees.includes(currentUser?.name ?? '')) {
        return;
      }

      if (!booking.reminder_minutes || booking.reminder_minutes === 0) {
        return;
      }

      if (booking.reminder_triggered) {
        return;
      }

      if (booking.status !== BookingStatus.UPCOMING) {
        return;
      }

      const reminderTime = dayjs(booking.start_time).subtract(booking.reminder_minutes, 'minute');
      const diffSeconds = reminderTime.diff(now, 'second');

      if (diffSeconds <= 0 && diffSeconds > -300) {
        triggerReminder(booking.id);
        onReminder(booking);
      }
    });
  };

  useEffect(() => {
    checkReminders();
    timerRef.current = window.setInterval(checkReminders, checkIntervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [bookings, currentUser, checkIntervalMs]);
}
