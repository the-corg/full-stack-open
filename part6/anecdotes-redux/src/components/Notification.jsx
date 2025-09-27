import { useSelector } from 'react-redux';

const Notification = () => {
  const notification = useSelector(({ notification }) => notification);
  const style = {
    border: 'solid',
    padding: 10,
    margin: '10px 0px',
    borderWidth: 1,
  };

  return notification ? <div style={style}>{notification}</div> : <div />;
};

export default Notification;
