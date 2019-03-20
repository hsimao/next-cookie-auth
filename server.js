const next = require('next')
const express = require('express')
const axios = require('axios')
const cookieParser = require('cookie-parser')

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const app = next({ dev })
const handle = app.getRequestHandler()

const AUTH_USER_TYPE = 'authenticated'

// cookie 安全設定
const COOKIE_SECRET = 'mars1234'
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !dev, // https 開發環境中不會限定要用 https
  signed: true,
}

const authenticate = async (email, password) => {
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/users')

  return data.find(user => {
    if (user.email === email && user.website === password) {
      return user
    }
  })
}

app.prepare().then(() => {
  const server = express()

  // express 4.0.0 以上內建解析 json 方法
  server.use(express.json())
  server.use(cookieParser(COOKIE_SECRET))

  server.post('/api/login', async (req, res) => {
    const { email, password } = req.body

    const user = await authenticate(email, password)

    if (!user) {
      return res.status(403).send('錯誤的email或password')
    }

    const userData = {
      name: user.name,
      email: user.email,
      type: AUTH_USER_TYPE,
    }
    res.cookie('token', userData, COOKIE_OPTIONS)
    res.json(userData)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`Listening on PORT ${port}`)
  })
})
