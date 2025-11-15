import { createContext, useReducer } from 'react';

const initialState = null;

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload;
    case 'LOGOUT':
      return initialState;
    default:
      return initialState;
  }
};

const UserContext = createContext();

export const UserContextProvider = props => {
  const [user, userDispatch] = useReducer(userReducer, initialState);
  return (
    <UserContext.Provider value={{ user, userDispatch }}>{props.children}</UserContext.Provider>
  );
};

export default UserContext;
