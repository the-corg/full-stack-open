import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);

  return (
    notification.message && (
      <Alert severity={notification.isError ? 'error' : 'success'}>{notification.message}</Alert>
    )
  );
};

export default Notification;
