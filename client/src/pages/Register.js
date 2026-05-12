
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [data, setData] = useState({});
  const nav = useNavigate();

  const register = async () => {
    try {
      await axios.post('https://mini-facebook-42lp.onrender.com/api/auth/register', data);
      nav('/');
    } catch (err) {
      alert("Registration failed ❌");
      console.log(err);
    }
  };

  return (
    <div className="register-container">

      <div className="register-box">
        <h2>Create Account</h2>

        <input
          placeholder="First Name"
          onChange={e => setData({ ...data, firstName: e.target.value })}
        />

        <input
          placeholder="Surname"
          onChange={e => setData({ ...data, surname: e.target.value })}
        />

        <input
          placeholder="Email"
          onChange={e => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setData({ ...data, password: e.target.value })}
        />

        <button onClick={register}>
          Create Account
        </button>

        <p onClick={() => nav('/')} className="login-link">
          Already have an account? Login
        </p>
      </div>

    </div>
  );
}