import Layout from '../components/Layout'
import Link from 'next/link'
import { authInitialProps } from '../lib/auth'

export default function Index(props) {
  return (
    <Layout title="Home" {...props}>
      <Link href="profile">
        <a>Go to Profile</a>
      </Link>
    </Layout>
  )
}

// 每次切換頁面調用 authInitialProps 方法來重新將用戶資料傳送到 props 內
Index.getInitialProps = authInitialProps()
