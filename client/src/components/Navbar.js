
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const nav = useNavigate();

  return (
    <div className="navbar">
      <div className="logo">MiniFacebook</div>

      <div className="nav-buttons">
        <button onClick={() => nav('/home')}>Home</button>

        <button onClick={() => nav('/friends')}>Friends</button>

        <button onClick={() => nav('/messages')}>Messages</button>

        {/* 🔔 Notifications with badge */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <button onClick={() => nav('/notifications')}>
            Notifications
          </button>

          {/* 🔴 Badge */}
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px'
          }}>
            1
          </span>
        </div>

      </div>
    </div>
  );
}