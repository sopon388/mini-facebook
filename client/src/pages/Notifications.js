import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Notifications() {
  const [data, setData] = useState([]);
  const me = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    axios.get(`https://mini-facebook-42lp.onrender.com/api/friends/notifications/${me._id}`)
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {data.map(d => (
        <p key={d._id}>Friend Request</p>
      ))}
    </div>
  );
}