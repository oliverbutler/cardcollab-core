import { getToast } from "util/functions";

const AccountReducer = (prevState, action) => {
  console.log(`🔒 Action `, action);

  switch (action.type) {
    case "LOG_IN":
      getToast().fire({
        icon: "success",
        title: "Logged In",
      });
      return {
        ...prevState,
        user: action.payload,
      };
    case "FOUND_SESSION":
      return {
        ...prevState,
        user: action.payload,
      };
    case "LOG_OUT":
      // fixme: log out
      getToast().fire({
        icon: "success",
        title: "Logged Out",
      });
      return {
        ...prevState,
        user: null,
      };
    default:
      return prevState;
  }
};

export default AccountReducer;
