import React, { useState } from 'react';
import './BlogPost.css';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';

function Blogpost({ imgSrc, blogTitle, blogDescription }) {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="blogContainer">
      <div className="blogImg">
        <img src={imgSrc} alt={blogTitle} />
      </div>
      <div className="blogTitle">{blogTitle}</div>
      <div className="blogDescription">{blogDescription}</div>
      <div className="blogIcons">
        <CommentIcon onClick={toggleComments} />
        <DeleteIcon className='deleteIcon' />
      </div>
      {showComments && (
        <div className="commentsSection">
          <p>Placeholder pour les commentaires...</p>
        </div>
      )}
    </div>
  );
}

export default Blogpost;
