import { createContext, useReducer } from 'react';

const initialState = { message: null, isError: false };

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'NOTIFICATION':
      return { message: action.payload, isError: false };
    case 'ERROR':
      return { message: action.payload, isError: true };
    case 'REMOVE':
      if (state.message !== action.payload) return state;
      return initialState;
    default:
      return initialState;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = props => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, 0);

  return (
    <NotificationContext.Provider value={{ notification, notificationDispatch }}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
