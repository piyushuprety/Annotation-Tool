import React from 'react';
import { useStore } from '../store/store';
// import './CommentMarker.css';

const CommentMarker = ({ comment, isActive }) => {
  const { setActiveComment } = useStore();

  const handleMarkerClick = (e) => {
    e.stopPropagation();
    setActiveComment(comment.id);
  };

  const countReplies = (replies) => {
    return Object.keys(replies).length;
  };

  const totalReplies = countReplies(comment.replies);

  return (
    <div
      className={`comment-marker ${isActive ? 'active' : ''}`}
      style={{
        left: `${comment.position.x}%`,
        top: `${comment.position.y}%`,
      }}
      onClick={handleMarkerClick}
    >
      <div className="marker-badge">
        {totalReplies > 0 ? `${totalReplies + 1}` : '1'}
      </div>
    </div>
  );
};

export default CommentMarker;
