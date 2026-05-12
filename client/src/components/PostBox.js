import { useState } from 'react';

export default function PostBox({ onPost }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null); // 👈 NEW

  const handlePost = () => {
    if (!text && !image && !video) return;

    onPost(text, image, video); // 👈 UPDATED

    setText('');
    setImage(null);
    setVideo(null);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      // 👇 file type check
      if (file.type.startsWith('image/')) {
        setImage(reader.result);
        setVideo(null);
      } else if (file.type.startsWith('video/')) {
        setVideo(reader.result);
        setImage(null);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="postbox">
      <textarea
        placeholder="What's on your mind "
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <input type="file" accept="image/*,video/*" onChange={handleFile} />

      <button onClick={handlePost}>
        Post
      </button>
    </div>
  );
}