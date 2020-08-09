/**
 * Attempts to login a user
 *
 * @param email
 * @param password
 */
export const login = (email: string, password: string) => {
  const deviceID = localStorage.getItem("deviceID");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      deviceID: deviceID ? deviceID : null,
    }),
  };
  return fetch("http://localhost:3000/api/auth/local/login", requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.status == "LOG_IN") {
        localStorage.setItem("deviceID", res.data.deviceID);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("accessToken", res.data.accessToken);
      }
      return res;
    })
};

export const refresh = () => {
  const deviceID = localStorage.getItem("deviceID");
  if (!deviceID) throw new Error("NO_DEVICEID");

  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("NO_REFRESH_TOKEN");

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      deviceID,
      refreshToken,
    }),
  };
};
