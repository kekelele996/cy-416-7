import { App, Button, Modal, Space, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Booking } from '@/models/booking';
import { REMINDER_LABELS } from '@/constants/booking';
import { useReminderScheduler } from '@/hooks/useReminderScheduler';
import { useRoomStore } from '@/stores/roomStore';
import { formatTimeRange } from '@/utils/formatters';

interface PendingReminder {
  booking: Booking;
  id: string;
}

export function ReminderNotifier() {
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const rooms = useRoomStore((state) => state.rooms);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingReminders, setPendingReminders] = useState<PendingReminder[]>([]);
  const [currentReminder, setCurrentReminder] = useState<PendingReminder | null>(null);

  const showNextReminder = useCallback(() => {
    if (pendingReminders.length > 0 && !modalOpen) {
      const next = pendingReminders[0];
      setCurrentReminder(next);
      setModalOpen(true);
    }
  }, [pendingReminders, modalOpen]);

  useEffect(() => {
    showNextReminder();
  }, [pendingReminders, showNextReminder]);

  const handleReminder = useCallback(
    (booking: Booking) => {
      const reminderId = `reminder-${booking.id}-${Date.now()}`;
      const roomName = rooms.find((r) => r.id === booking.room_id)?.name ?? '未知会议室';

      notification.open({
        message: '会议即将开始',
        description: `${booking.title}\n${roomName}\n${formatTimeRange(booking.start_time, booking.end_time)}`,
        icon: <BellOutlined style={{ color: '#faad14' }} />,
        duration: 0,
        onClick: () => {
          navigate('/my-bookings');
        },
      });

      setPendingReminders((prev) => [...prev, { booking, id: reminderId }]);
    },
    [notification, rooms, navigate],
  );

  useReminderScheduler({ onReminder: handleReminder });

  const handleClose = () => {
    setModalOpen(false);
    setPendingReminders((prev) => prev.slice(1));
    setCurrentReminder(null);
  };

  const handleGoToMeeting = () => {
    navigate('/my-bookings');
    handleClose();
  };

  const booking = currentReminder?.booking;
  const room = booking ? rooms.find((r) => r.id === booking.room_id) : null;

  return (
    <Modal
      open={modalOpen}
      onCancel={handleClose}
      footer={
        <Space>
          <Button onClick={handleClose}>知道了</Button>
          <Button type="primary" onClick={handleGoToMeeting}>
            查看详情
          </Button>
        </Space>
      }
      width={420}
      centered
    >
      {booking && (
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
            <BellOutlined className="text-xl text-amber-500" />
          </div>
          <div className="flex-1">
            <Typography.Title level={5} className="!m-0 !mb-2">
              会议即将开始
            </Typography.Title>
            <div className="space-y-1 text-sm">
              <div>
                <Typography.Text strong>{booking.title}</Typography.Text>
              </div>
              <div className="text-[var(--rf-muted)]">
                <span>会议室：</span>
                <span>{room?.name ?? '未知'}</span>
              </div>
              <div className="text-[var(--rf-muted)]">
                <span>时间：</span>
                <span>{formatTimeRange(booking.start_time, booking.end_time)}</span>
              </div>
              <div className="text-[var(--rf-muted)]">
                <span>还有：</span>
                <span className="text-amber-500">
                  {booking.reminder_minutes ? REMINDER_LABELS[booking.reminder_minutes] : ''}开始
                </span>
              </div>
              {booking.attendees.length > 0 && (
                <div className="text-[var(--rf-muted)]">
                  <span>参会人：</span>
                  <span>{booking.attendees.join('、')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
