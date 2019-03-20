import axios from 'axios'

// 預設發送請求時需夾帶 cookie
axios.defaults.withCredentials = true

export const loginUser = async (email, password) => {
  await axios.post('/api/login', { email, password })
}

export const getUserProfile = async () => {
  const { data } = await axios.get('/api/profile')
  return data
}
