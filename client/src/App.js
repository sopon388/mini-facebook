import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Friends from './pages/Friends';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path='/' element={<Login />} />

        <Route path='/register' element={<Register />} />

        <Route path='/home' element={<Home />} />

        <Route path='/friends' element={<Friends />} />

        {/* 🔥 MESSAGE FRIEND LIST */}
        <Route path='/messages' element={<Messages />} />

        {/* 🔥 REALTIME CHAT */}
        <Route path='/messages/:id' element={<Messages />} />

        <Route
          path='/notifications'
          element={<Notifications />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;