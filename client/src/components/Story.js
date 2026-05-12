import './Story.css';
import { useState } from 'react';

export default function Story() {
  const [image, setImage] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  return (
    <div className="story-container">

      {/* Create Story */}
      <label className="story create">
        <input type="file" hidden onChange={handleFile} />
        <span>+ Create Story</span>
      </label>

      {/* Show Story */}
      {image && (
        <div className="story">
          <img src={image} alt="story" />
        </div>
      )}
    </div>
  );
}