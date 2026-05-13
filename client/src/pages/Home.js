

import Navbar from '../components/Navbar';
import PostBox from '../components/PostBox';
import Story from '../components/Story';
import axios from 'axios';
const API = process.env.REACT_APP_API_URL;
import { useState, useEffect } from 'react';

export default function Home() {

  const user = JSON.parse(localStorage.getItem('user') || "{}");

  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});

  const [cover, setCover] = useState(
    user._id ? localStorage.getItem('cover_' + user._id) : null
  );

  const [profile, setProfile] = useState(
    user._id ? localStorage.getItem('profile_' + user._id) : null
  );

  // 🔥 LOAD POSTS
  const load = async () => {
    try {
      const res = await axios.get('https://mini-facebook-1.onrender.com/api/posts');
      setPosts(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 CREATE POST (UPDATED)
  const createPost = async (text, image, video) => {
    if (!user._id) return;

    const name = `${user.firstName || ''} ${user.surname || ''}`.trim();
    const latestProfile = localStorage.getItem('profile_' + user._id);

    try {
      await axios.post('https://mini-facebook-1.onrender.com/api/posts', {
        userId: user._id,
        userName: name || "User",
        text,
        image,
        video, // 👈 NEW
        profilePic: latestProfile
      });

      load();
    } catch (err) {
      console.log(err);
    }
  };

  // 👍 LIKE
  const likePost = async (id) => {
    try {
      await axios.post(`https://mini-facebook-1.onrender.com/api/posts/like/${id}`);
      load();
    } catch (err) {
      console.log(err);
    }
  };

  // 💬 COMMENT
  const commentPost = async (id) => {
    if (!commentText[id]) return;

    try {
      await axios.post(`https://mini-facebook-1.onrender.com/api/posts/comment/${id}`, {
        text: commentText[id]
      });

      setCommentText({ ...commentText, [id]: '' });
      load();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 DELETE POST
  const deletePost = async (id) => {
    try {
      await axios.delete(`https://mini-facebook-1.onrender.com/api/posts/${id}`);
      load();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 COVER UPLOAD
  const handleCover = (e) => {
    const file = e.target.files[0];
    if (!file || !user._id) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setCover(reader.result);
      localStorage.setItem('cover_' + user._id, reader.result);
    };

    reader.readAsDataURL(file);
  };

  // 🔥 PROFILE UPLOAD
  const handleProfile = (e) => {
    const file = e.target.files[0];
    if (!file || !user._id) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile(reader.result);
      localStorage.setItem('profile_' + user._id, reader.result);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="home-wrapper">

        {/* COVER */}
        <div className="cover-box">
          <img
            src={cover || "https://via.placeholder.com/600x250"}
            className="cover-img"
            alt="cover"
          />

          <label className="cover-upload">
            Upload
            <input type="file" hidden onChange={handleCover} />
          </label>
        </div>

        {/* PROFILE */}
        <div className="profile-box">
          <label>
            <img
              src={profile || "https://i.pravatar.cc/100"}
              className="profile-img"
              alt="profile"
            />
            <input type="file" hidden onChange={handleProfile} />
          </label>

          <h3>
            {(user.firstName || "User")} {(user.surname || "")}
          </h3>
        </div>

        <Story />
        <PostBox onPost={createPost} />

        {/* POSTS */}
        {posts.map(p => (
          <div key={p._id} className="post-card">

            <div className="post-header">
              <img
                src={p.profilePic || "https://i.pravatar.cc/40"}
                className="post-profile"
                alt=""
              />

              <strong>
                {p.userName && p.userName !== "undefined undefined"
                  ? p.userName
                  : "User"}
              </strong>

              {p.userId === user._id && (
                <button
                  onClick={() => deletePost(p._id)}
                  style={{
                    marginLeft: 'auto',
                    background: '#e41e3f',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              )}
            </div>

            <p>{p.text}</p>

            {/* IMAGE */}
            {p.image && (
              <img src={p.image} className="post-img" alt="" />
            )}

            {/* VIDEO 👇 NEW */}
            {p.video && (
              <video className="post-img" controls>
                <source src={p.video} type="video/mp4" />
              </video>
            )}

            <button
              className="like-btn"
              onClick={() => likePost(p._id)}
            >
              👍 Like ({p.likes || 0})
            </button>

            <div className="comment-box">
              <input
                placeholder="Write comment..."
                value={commentText[p._id] || ''}
                onChange={e => setCommentText({
                  ...commentText,
                  [p._id]: e.target.value
                })}
              />
              <button onClick={() => commentPost(p._id)}>
                Send
              </button>
            </div>

            {(p.comments || []).map((c, i) => (
              <p key={i}>💬 {c.text}</p>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
}