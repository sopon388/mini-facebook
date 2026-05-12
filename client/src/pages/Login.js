
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [data, setData] = useState({});
  const nav = useNavigate();

  const login = async () => {
    const res = await axios.post('https://mini-facebook-42lp.onrender.com/api/auth/login', data);

    if (res.data.error) {
      alert(res.data.error);
      return;
    }

    localStorage.setItem('user', JSON.stringify(res.data));
    nav('/home');
  };

  return (
    <div className="login-container">

      <div className="login-box">
        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={e => setData({...data, email: e.target.value})}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setData({...data, password: e.target.value})}
        />

        <button className="login-btn" onClick={login}>
          Login
        </button>

        <button className="register-btn" onClick={() => nav('/register')}>
          Create Account
        </button>
      </div>

    </div>
  );
}