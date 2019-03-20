import Layout from '../components/Layout'
import { getUserProfile, authInitialProps } from '../lib/auth'
export default class Profile extends React.Component {
  state = {
    user: null,
  }

  componentDidMount() {
    getUserProfile()
      .then(user => this.setState({ user: user }))
      .catch(err => console.log(err))
  }

  render() {
    const { user } = this.state
    return (
      <Layout title="Profile" {...this.props}>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </Layout>
    )
  }
}

// 進到該頁面時使用 authInitialProps 方法來重新將用戶資料傳送到 props 內
Profile.getInitialProps = authInitialProps()
