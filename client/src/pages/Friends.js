import Navbar from '../components/Navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Friends() {

  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);

  const me = JSON.parse(localStorage.getItem('user'));

  const nav = useNavigate();


  // 🔥 LOAD USERS
  const loadUsers = async () => {

    const res = await axios.get(
      'https://mini-facebook-42lp.onrender.com/api/auth/users'
    );

    setUsers(
      res.data.filter(u => u._id !== me._id)
    );
  };


  // 🔥 LOAD REQUESTS
  const loadRequests = async () => {

    const res = await axios.get(
      `https://mini-facebook-42lp.onrender.com/api/friends/notifications/${me._id}`
    );

    setRequests(res.data);
  };


  // 🔥 LOAD FRIENDS
  const loadFriends = async () => {

    const res = await axios.get(
      `https://mini-facebook-42lp.onrender.com/api/friends/list/${me._id}`
    );

    setFriends(res.data);
  };


  // 🔥 SEND REQUEST
  const sendRequest = async (id) => {

    try {

      const res = await axios.post(
        'https://mini-facebook-42lp.onrender.com/api/friends/send',
        {
          from: me._id,
          to: id
        }
      );

      alert(res.data.message || "Request Sent 😏");

    } catch (err) {

      console.log(err);
    }
  };


  // 🔥 ACCEPT REQUEST
  const acceptRequest = async (reqId) => {

    await axios.post(
      'https://mini-facebook-42lp.onrender.com/api/friends/accept',
      {
        id: reqId
      }
    );

    loadRequests();
    loadFriends();
  };


  // 🔥 REMOVE FRIEND
  const removeFriend = async (id) => {

    await axios.post(
      'https://mini-facebook-42lp.onrender.com/api/friends/remove',
      {
        from: me._id,
        to: id
      }
    );

    loadFriends();
  };


  // 🔥 CHECK FRIEND
  const isFriend = (id) => {

    return friends.some(f =>

      (f.from === id && f.to === me._id) ||

      (f.to === id && f.from === me._id)
    );
  };


  // 🔥 GET REQUEST
  const getRequest = (id) => {

    return requests.find(r => r.from === id);
  };


  useEffect(() => {

    loadUsers();
    loadRequests();
    loadFriends();

  }, []);


  return (
    <div>

      <Navbar />

      <div style={{
        width: '500px',
        margin: '20px auto'
      }}>

        {users.map(u => {

          const req = getRequest(u._id);

          return (

            <div
              key={u._id}
              style={{
                background: 'white',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >

              {/* 🔥 USER INFO */}
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>

                <img
                  src={
                    localStorage.getItem('profile_' + u._id)
                    || "https://i.pravatar.cc/50"
                  }

                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    marginRight: '10px'
                  }}
                />

                <strong>
                  {u.firstName} {u.surname}
                </strong>

              </div>


              {/* 🔥 BUTTONS */}
              <div style={{
                display: 'flex',
                gap: '10px'
              }}>

                {isFriend(u._id) ? (
                  <>

                    {/* 🔥 MESSAGE BUTTON */}
                    <button
  onClick={() => nav('/messages/' + u._id)}
>
  Message
</button>
                    {/* 🔥 REMOVE */}
                    <button
                      onClick={() => removeFriend(u._id)}
                    >
                      Remove
                    </button>

                  </>
                ) : req ? (

                  <button
                    onClick={() => acceptRequest(req._id)}
                  >
                    Accept
                  </button>

                ) : (

                  <button
                    onClick={() => sendRequest(u._id)}
                  >
                    Add Friend
                  </button>

                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}