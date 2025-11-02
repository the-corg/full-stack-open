import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);

  return (
    notification.message && (
      <div className={notification.isError ? 'error' : 'notification'}>
        {notification.message}
      </div>
    )
  );
};

export default Notification;
