import { getUserProfile } from '../lib/auth'

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
    return <pre>{JSON.stringify(user, null, 2)}</pre>
  }
}
