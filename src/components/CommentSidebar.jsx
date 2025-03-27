import React from 'react';
import { useStore } from '../store/store';
// import './CommentSidebar.css';

const CommentSidebar = () => {
  const { images, currentImageId, setActiveComment } = useStore();

  const currentImage = images[currentImageId];

  if (!currentImage) {
    return (
      <aside className="comment-sidebar">
        <h2>Comments</h2>
        <p className="no-comments">No image selected</p>
      </aside>
    );
  }

  const comments = currentImage.comments;
  const hasComments = Object.keys(comments).length > 0;

  const handleCommentClick = (commentId) => {
    setActiveComment(commentId);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const countReplies = (replies) => {
    return Object.keys(replies).length;
  };

  return (
    <aside className="comment-sidebar">
      <h2>Comments ({hasComments ? Object.keys(comments).length : 0})</h2>

      {!hasComments && (
        <p className="no-comments">
          No comments yet. Click on the image to add a comment.
        </p>
      )}

      {hasComments && (
        <ul className="comment-list">
          {Object.values(comments).map((comment) => (
            <li
              key={comment.id}
              className="sidebar-comment"
              onClick={() => handleCommentClick(comment.id)}
            >
              <div className="sidebar-comment-header">
                <span className="comment-time">
                  {formatTimestamp(comment.timestamp)}
                </span>
                <span className="reply-count">
                  {countReplies(comment.replies) > 0 &&
                    `${countReplies(comment.replies)} replies`}
                </span>
              </div>
              <div className="sidebar-comment-text">
                {comment.text.length > 100
                  ? `${comment.text.substring(0, 100)}...`
                  : comment.text}
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default CommentSidebar;
