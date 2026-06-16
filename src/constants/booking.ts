export enum BookingStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  ENDED = 'ended',
  CANCELLED = 'cancelled',
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.UPCOMING]: '待开始',
  [BookingStatus.ONGOING]: '进行中',
  [BookingStatus.ENDED]: '已结束',
  [BookingStatus.CANCELLED]: '已取消',
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  [BookingStatus.UPCOMING]: 'blue',
  [BookingStatus.ONGOING]: 'green',
  [BookingStatus.ENDED]: 'default',
  [BookingStatus.CANCELLED]: 'red',
};

export const BOOKING_STATUS_ORDER: BookingStatus[] = [
  BookingStatus.ONGOING,
  BookingStatus.UPCOMING,
  BookingStatus.ENDED,
  BookingStatus.CANCELLED,
];

export const BOOKING_MUTABLE_STATUSES = [
  BookingStatus.UPCOMING,
  BookingStatus.ONGOING,
];

export type ReminderMinutes = 0 | 5 | 15;

export const REMINDER_OPTIONS: { value: ReminderMinutes; label: string }[] = [
  { value: 5, label: '提前 5 分钟' },
  { value: 15, label: '提前 15 分钟' },
];

export const REMINDER_LABELS: Record<ReminderMinutes, string> = {
  0: '不提醒',
  5: '提前5分钟',
  15: '提前15分钟',
};
