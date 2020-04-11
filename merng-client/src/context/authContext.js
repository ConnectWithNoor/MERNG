import React, { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null,
};

if (localStorage.getItem('token')) {
  const decodedToken = jwtDecode(localStorage.getItem('token'));

  if (Date.now() > decodedToken.exp * 1000) {
    localStorage.removeItem('token');
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

function AuthReducer(state = initialState, action) {
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
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ user: state.user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
