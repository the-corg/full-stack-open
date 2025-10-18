import { createContext, useReducer, useContext } from 'react';

const notificationReducer = (state, action) => {
  switch (action.type) {
    case '+':
      return action.payload;
    case '-':
      if (state !== action.payload) return state;
      return null;
    default:
      return null;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = props => {
  const [counter, counterDispatch] = useReducer(notificationReducer, 0);

  return (
    <NotificationContext.Provider value={[counter, counterDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => useContext(NotificationContext)[0];

export const useNotificationDispatch = () => useContext(NotificationContext)[1];

export default NotificationContext;
