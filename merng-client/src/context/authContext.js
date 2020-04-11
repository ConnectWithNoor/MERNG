import React, { createContext, useReducer, Children } from 'react';

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

function AuthReducer(state = {}, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthContextProvider(props) {
  const [state, dispatch] = useReducer(AuthReducer, { user: null });

  const login = (userData) => {
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
