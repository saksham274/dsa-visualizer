const BASE_URL = 'http://localhost:5000/api'

export async function updateProgress(topic, token) {
  try {
    const response = await fetch(`${BASE_URL}/auth/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ topic })
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Progress update failed:', error)
  }
}

export async function getProfile(token) {
  try {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Profile fetch failed:', error)
  }
}