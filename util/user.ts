import fetch from "isomorphic-fetch";

export const fetchUser = async (cookie = "") => {
  if (typeof window !== "undefined" && window.__user) {
    return window.__user;
  }

  const res = await fetch(
    "/api/auth0/me",
    cookie
      ? {
          headers: {
            cookie,
          },
        }
      : {}
  );

  if (!res.ok) {
    delete window.__user;
    return null;
  }

  const json = await res.json();
  if (typeof window !== "undefined") {
    window.__user = json;
  }
  return json;
};

export const useFetchUser = (props) => {
  const state = props.state;
  const dispatch = props.dispatch;
  const required = props.required || false;

  dispatch({
    type: "SET_LOADING",
    payload: () => !(typeof window !== "undefined" && window.__user),
  });
  dispatch({
    type: "SET_USER",
    payload: () => {
      if (typeof window === "undefined") {
        return null;
      }
      return window.__user || null;
    },
  });

  if (!state.loading && state.user) {
    return;
  }
  dispatch({ type: "SET_LOADING", payload: true });
  let isMounted = true;

  fetchUser().then((user) => {
    // Only set the user if the component is still mounted
    if (isMounted) {
      // When the user is not logged in but login is required
      if (required && !user) {
        window.location.href = "/api/auth0/login";
        return;
      }
      dispatch({ type: "SET_USER", payload: user });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  });

  return () => {
    isMounted = false;
  };

  return;
};
