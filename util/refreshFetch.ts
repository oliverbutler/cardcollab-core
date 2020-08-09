import React, { useEffect, EffectCallback } from "react";
import { parseJwt } from "./functions";

var url = "http://localhost:3000/api"

type Options = {
  type: "GET" | "POST" | "DELETE",
  token: boolean,
  body: string,
}

/**
 * Custom fetch hook
 * - Error Handling
 * - Authentication
 * - Automatic Token Refresh
 * 
 * @param endpoint The URL 
 * @param config 
 */
const refreshFetch = async (endpoint: String, config: Options) => {

  console.log("🔄 Fetch", endpoint, config)

  if (config.token) {

    // Check if the access token is valid
    var token = parseJwt(localStorage.getItem('accessToken'))

    // todo: check this is the right date (not UTC)
    if (token.exp < Date.now()) {
      console.log('token expired, trying refresh')

      fetch(url + "/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sub: token.sub,
          refreshToken: localStorage.getItem('refreshToken'),
          deviceID: localStorage.getItem('deviceID')
        })
      })
        .then(res => {
          res.json().then((json) => {
            localStorage.setItem('accessToken', json.accessToken)
            localStorage.setItem('refreshToken', json.refreshToken)
          })
        })
    }
  }

  var headers = { "Content-Type": "application/json" }
  if (config.token)
    headers['Authorization'] = "Bearer " + localStorage.getItem('accessToken')

  var requestOptions: RequestInit = {
    method: config.type,
    headers,
    body: JSON.stringify(config.body)
  }

  return fetch(url + endpoint, requestOptions).then((res) => res.json())

};

export default refreshFetch