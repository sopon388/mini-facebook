import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import io from 'socket.io-client';

const socket = io('https://mini-facebook-42lp.onrender.com');


export default function Chat() {

  const { id } = useParams();

  const me = JSON.parse(localStorage.getItem('user'));

  const [messages, setMessages] = useState([]);

  const [text, setText] = useState('');


  // 🔥 LOAD OLD CHAT
  const loadMessages = async () => {

    const res = await axios.get(
      `https://mini-facebook-42lp.onrender.com/api/messages/${me._id}/${id}`
    );

    setMessages(res.data);
  };


  // 🔥 SEND MESSAGE
  const sendMessage = async () => {

    if (!text) return;

    const msg = {
      sender: me._id,
      receiver: id,
      text
    };


    // save db
    await axios.post(
      'https://mini-facebook-42lp.onrender.com/api/messages',
      msg
    );


    // realtime
    socket.emit('sendMessage', msg);

    setMessages([...messages, msg]);

    setText('');
  };


  // 🔥 RECEIVE MESSAGE
  useEffect(() => {

    socket.emit('join', me._id);

    socket.on('receiveMessage', (data) => {

      if (data.sender === id) {

        setMessages(prev => [...prev, data]);
      }
    });

    loadMessages();

  }, []);


  return (
    <div style={{ padding: 20 }}>

      <h2>Chat</h2>

      <div style={{
        height: '400px',
        overflowY: 'scroll',
        border: '1px solid gray',
        padding: '10px',
        marginBottom: '10px'
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
              display: 'inline-block'
            }}>
              {m.text}
            </span>

          </div>
        ))}

      </div>


      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write message..."
      />

      <button onClick={sendMessage}>
        Send
      </button>

    </div>
  );
}