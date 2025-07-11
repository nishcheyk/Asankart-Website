import React from "react";

export const AuthContext = React.createContext({
  token: null,
  userId: null,
  username: null,
  isAdmin: false,
  login: (token, userId, username, isAdmin) => {},
  logout: () => {},
});
