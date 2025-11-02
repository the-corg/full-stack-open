import { useContext } from 'react';
import NotificationContext from './NotificationContext';

const Notification = () => {
  const { notification } = useContext(NotificationContext);

  if (!notification) return null;

  return (
    notification.message && (
      <div className={notification.isError ? 'error' : 'notification'}>{notification.message}</div>
    )
  );
};

export default Notification;
