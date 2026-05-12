import Navbar from '../components/Navbar';

import { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';

import io from 'socket.io-client';


const socket = io('http://localhost:5000');


export default function Messages() {

  const { id } = useParams();

  const nav = useNavigate();

  const me = JSON.parse(localStorage.getItem('user'));

  const [friends, setFriends] = useState([]);

  const [messages, setMessages] = useState([]);

  const [text, setText] = useState('');


  // 🔥 LOAD FRIENDS
  const loadFriends = async () => {

    try {

      const res = await axios.get(
        `http://localhost:5000/api/friends/list/${me._id}`
      );

      setFriends(res.data);

    } catch (err) {

      console.log(err);
    }
  };


  // 🔥 LOAD MESSAGES
  const loadMessages = async () => {

    if (!id) return;

    try {

      const res = await axios.get(
        `http://localhost:5000/api/messages/${me._id}/${id}`
      );

      setMessages(res.data);

    } catch (err) {

      console.log(err);
    }
  };


  // 🔥 SEND MESSAGE
  const sendMessage = async () => {

    if (!text || !id) return;

    const msg = {
      sender: me._id,
      receiver: id,
      text
    };

    try {

      // save database
      await axios.post(
        'http://localhost:5000/api/messages',
        msg
      );

      // realtime
      socket.emit('sendMessage', msg);

      setMessages(prev => [...prev, msg]);

      setText('');

    } catch (err) {

      console.log(err);
    }
  };


  // 🔥 SOCKET RECEIVE
  useEffect(() => {

    if (!me?._id) return;

    socket.emit('join', me._id);

    socket.on('receiveMessage', (data) => {

      if (data.sender === id) {

        setMessages(prev => [...prev, data]);
      }
    });

    loadFriends();

    loadMessages();

    return () => {

      socket.off('receiveMessage');
    };

  }, [id]);


  return (
    <div>

      <Navbar />

      <div style={{
        width: '900px',
        margin: '20px auto',
        display: 'flex',
        gap: '20px'
      }}>

        {/* 🔥 FRIEND LIST */}
        <div style={{
          width: '300px',
          background: 'white',
          borderRadius: '10px',
          padding: '10px'
        }}>

          <h3>Friends</h3>

          {friends.map((f, i) => (

            <div
              key={i}

              onClick={() =>
                nav('/messages/' + f._id)
              }

              style={{
                padding: '10px',
                borderBottom: '1px solid #ddd',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >

              {/* PROFILE */}
              <img
                src={
                  localStorage.getItem('profile_' + f._id)
                  || "https://i.pravatar.cc/50"
                }

                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%'
                }}
              />

              {/* NAME */}
              <strong>
                {f.firstName} {f.surname}
              </strong>

            </div>
          ))}

        </div>


        {/* 🔥 CHAT SECTION */}
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '10px',
          padding: '10px'
        }}>

          {!id ? (

            <h3>Select a friend 😏</h3>

          ) : (

            <>
              <h3>Realtime Chat</h3>

              {/* CHAT BOX */}
              <div style={{
                height: '400px',
                overflowY: 'scroll',
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '10px'
              }}>

                {messages.map((m, i) => (

                  <div
                    key={i}

                    style={{
                      textAlign:
                        m.sender === me._id
                          ? 'right'
                          : 'left',

                      marginBottom: '10px'
                    }}
                  >

                    <span style={{
                      display: 'inline-block',

                      background:
                        m.sender === me._id
                          ? '#1877f2'
                          : '#ddd',

                      color:
                        m.sender === me._id
                          ? 'white'
                          : 'black',

                      padding: '8px 12px',

                      borderRadius: '10px',

                      maxWidth: '70%'
                    }}>

                      {m.text}

                    </span>

                  </div>
                ))}

              </div>


              {/* INPUT */}
              <div style={{
                display: 'flex',
                gap: '10px'
              }}>

                <input
                  value={text}

                  onChange={e => setText(e.target.value)}

                  placeholder="Write message..."

                  style={{
                    flex: 1,
                    padding: '10px'
                  }}
                />

                <button onClick={sendMessage}>
                  Send
                </button>

              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}