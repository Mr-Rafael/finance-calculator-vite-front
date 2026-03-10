const API = "http://localhost:8080"

export async function apiFetch(path, options = {}) {

  let accessToken = localStorage.getItem("accessToken")

  const res = await fetch(API + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers
    },
    credentials: "include"
  })

  // If access token expired
  if (res.status === 401) {

    const refreshRes = await fetch(API + "/app/users/refresh", {
      method: "POST",
      credentials: "include"
    })

    if (!refreshRes.ok) {
      logout()
      throw new Error("Session expired")
    }

    const data = await refreshRes.json()

    localStorage.setItem("accessToken", data.access_token)

    // retry original request
    return fetch(API + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.access_token}`,
        ...options.headers
      },
      credentials: "include"
    })
  }

  return res
}

export function logout() {
  localStorage.removeItem("accessToken")
  window.location.href = "/login"
}