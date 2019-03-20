import { loginUser } from '../lib/auth'

class LoginForm extends React.Component {
  state = {
    email: 'Sincere@april.biz',
    password: 'hildegard.org',
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = event => {
    event.preventDefault()

    const { email, password } = this.state
    loginUser(email, password)
  }

  render() {
    const { email, password } = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <input type="email" name="email" value={email} placeholder="email" onChange={this.handleChange} />
        </div>
        <div>
          <input type="password" name="password" value={password} placeholder="password" onChange={this.handleChange} />
        </div>
        <button type="submit">送出</button>
      </form>
    )
  }
}

export default LoginForm
