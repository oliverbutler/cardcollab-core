import React, { useReducer } from "react";
import AccountReducer from "reducers/accountReducer";

export const AccountContext = React.createContext();

const Account = ({ children }) => {
  const initialState = {
    user: null,
  };

  const [state, dispatch] = useReducer(AccountReducer, initialState);

  return (
    <AccountContext.Provider value={{ state, dispatch }}>
      {children}
    </AccountContext.Provider>
  );
};

export default Account;
