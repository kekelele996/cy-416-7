import { BookingStatus, ReminderMinutes } from '@/constants/booking';

export interface Booking {
  id: string;
  room_id: string;
  user_id: string;
  title: string;
  attendees: string[];
  start_time: string;
  end_time: string;
  status: BookingStatus;
  created_at: string;
  checked_in?: boolean;
  reminder_minutes?: ReminderMinutes;
  reminder_triggered?: boolean;
}

export type BookingDraft = Omit<Booking, 'id' | 'status' | 'created_at' | 'checked_in' | 'reminder_triggered'> & {
  id?: string;
};
