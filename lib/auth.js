import axios from 'axios'
import Router from 'next/router'

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
export const authInitialProps = isProtectedRoute => ({ req, res }) => {
  const auth = req ? getServerSideToken(req) : getClientToken()
  // 取得當前網址
  const currentPath = req ? req.url : window.location.path

  const user = auth.user
  const isAnonymous = !user || user.type !== 'authenticated'

  // 如果是被保護的路線，或者沒有取得用戶資訊或權限(user.type)不符合, 且不在 /login頁面
  if (isProtectedRoute && isAnonymous && currentPath !== '/login') {
    return redirectUser(res, '/login')
  }
  return { auth }
}

const redirectUser = (res, path) => {
  if (res) {
    res.redirect(302, path)
    res.finished = true
    return {}
  }
  Router.replace(path)
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

// 登出
// 1.) 清除 window 中的 user 變數資料
// 2.) 送 api 到後端清除 cookie 資料
export const logoutUser = async () => {
  if (typeof window !== 'undefined') {
    window[WINDOW_USER_SCRIPT_VARIABLE] = {}
  }
  await axios.post('/api/logout')
  Router.push('/login')
}
