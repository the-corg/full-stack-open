interface NotificationProps {
  errorMessage: string;
}

const Notification = ({ errorMessage }: NotificationProps) => {
  const style = { color: 'red' } as React.CSSProperties;
  if (errorMessage === null) return null;
  return <div style={style}>{errorMessage}</div>;
};

export default Notification;
