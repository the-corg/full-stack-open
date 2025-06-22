const showNotification = (setMessage, message) => {
  setMessage(message);
  setTimeout(() => setMessage(null), 3000);
};

export default { showNotification };
