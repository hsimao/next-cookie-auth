import axios from 'axios'

// 預設發送請求時需夾帶 cookie
axios.defaults.withCredentials = true

// 設定儲存用戶資料到 window 全域變數內的名稱
const WINDOW_USER_SCRIPT_VARIABLE = '__USER__'

export const getServerSideToken = req => {
  const { signedCookies = {} } = req

  if (!signedCookies) {
    return {}
  } else if (!signedCookies.token) {
    return {}
  }
  return { user: signedCookies.token }
}

// client 端, 從 window 全域變數獲取用戶資料
export const getClientToken = () => {
  if (typeof window !== 'undefined') {
    const user = window[WINDOW_USER_SCRIPT_VARIABLE] || {}
    return { user }
  }
  return { user: {} }
}

export const getUserScript = user => {
  return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(user)}`
}

// 判斷是否第一次加載(會跟 server 發出請求，用 req 判斷)
// 來選擇從哪獲取用戶資料
export const authInitialProps = () => ({ req }) => {
  const auth = req ? getServerSideToken(req) : getClientToken()
  return { auth }
}

export const loginUser = async (email, password) => {
  const { data } = await axios.post('/api/login', { email, password })

  // 如果在 client 端就將資料儲存到全域
  if (typeof window !== 'undefined') {
    window[WINDOW_USER_SCRIPT_VARIABLE] = data || {}
  }
}

export const getUserProfile = async () => {
  const { data } = await axios.get('/api/profile')
  return data
}
