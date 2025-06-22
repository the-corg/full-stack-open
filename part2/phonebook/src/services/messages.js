const showNotification = (setMessage, message) => {
  setMessage(message);
  setTimeout(() => setMessage(null), 3000);
};

const showError = (setMessage, message) => {
  setMessage(message);
  setTimeout(() => setMessage(null), 5000);
};

export default { showNotification, showError };
