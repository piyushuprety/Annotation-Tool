import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/store';
import debounce from 'lodash/debounce';
// import './CommentPopup.css';

const CommentPopup = ({ position, onSubmit, onCancel, comment, isNew }) => {
  const [newText, setNewText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const {
    addReply,
    editComment,
    editReply,
    deleteComment,
    deleteReply,
    setActiveComment,
  } = useStore();

  const popupRef = useRef(null);
  const textareaRef = useRef(null);
  const replyTextareaRef = useRef(null);

  useEffect(() => {
    // Focus textarea for new comments
    if (isNew && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isNew]);

  // Stop event propagation to prevent canvas click from interfering
  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  const debouncedSetNewText = debounce(setNewText, 100);
  const debouncedSetReplyText = debounce(setReplyText, 100);
  const debouncedSetEditText = debounce(setEditText, 100);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    onSubmit(newText);
    setNewText('');
  };

  const handleCancelComment = () => {
    onCancel();
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (comment && replyText.trim()) {
      const replyId = `reply_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      addReply(comment.imageId, comment.id, replyId, {
        id: replyId,
        text: replyText.trim(),
        timestamp: new Date().toISOString(),
      });

      setReplyText('');
    }
  };

  // Stop propagation for textarea focus
  const handleTextareaFocus = (e) => {
    e.stopPropagation();
  };

  // Prevent textarea changes from triggering other events
  const handleTextareaChange = (e, setterFunction) => {
    e.stopPropagation();
    setterFunction(e.target.value);
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);

    // Focus the edit textarea on the next render
    setTimeout(() => {
      const editTextarea = document.getElementById(`edit-${id}`);
      if (editTextarea) editTextarea.focus();
    }, 10);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = (id, isReply = false) => {
    if (editText.trim()) {
      if (isReply) {
        editReply(comment.imageId, comment.id, id, editText.trim());
      } else {
        editComment(comment.imageId, comment.id, editText.trim());
      }
    }
    setEditingId(null);
  };

  const handleDeleteComment = () => {
    if (
      window.confirm(
        'Are you sure you want to delete this comment and all its replies?'
      )
    ) {
      deleteComment(comment.imageId, comment.id);
      setActiveComment(null);
    }
  };

  const handleDeleteReply = (replyId) => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
      deleteReply(comment.imageId, comment.id, replyId);
    }
  };

  // Calculate position to keep popup within viewport
  const getAdjustedPosition = () => {
    // Default styles
    const style = {
      left: `${position.x}%`,
      top: `${position.y}%`,
    };

    return style;
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (isNew) {
    return (
      <div
        className="comment-popup new-comment"
        style={getAdjustedPosition()}
        ref={popupRef}
        onClick={handlePopupClick}
      >
        <form onSubmit={handleSubmitComment}>
          <textarea
            ref={textareaRef}
            placeholder="Add a comment..."
            value={newText}
            onChange={(e) => handleTextareaChange(e, debouncedSetNewText)}
            onFocus={handleTextareaFocus}
            onClick={(e) => e.stopPropagation()}
            required
          />
          <div className="comment-actions">
            <button type="button" onClick={handleCancelComment}>
              Cancel
            </button>
            <button type="submit">Comment</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      className="comment-popup"
      style={getAdjustedPosition()}
      ref={popupRef}
      onClick={handlePopupClick}
    >
      <div className="comment-header">
        <span className="timestamp">{formatTime(comment.timestamp)}</span>
        <div className="comment-controls">
          <button
            className="edit-button"
            onClick={() => startEditing(comment.id, comment.text)}
          >
            Edit
          </button>
          <button className="delete-button" onClick={handleDeleteComment}>
            Delete
          </button>
        </div>
      </div>

      {editingId === comment.id ? (
        <div className="edit-container">
          <textarea
            id={`edit-${comment.id}`}
            value={editText}
            onChange={(e) => handleTextareaChange(e, debouncedSetEditText)}
            onFocus={handleTextareaFocus}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="edit-actions">
            <button onClick={cancelEditing}>Cancel</button>
            <button onClick={() => saveEdit(comment.id)}>Save</button>
          </div>
        </div>
      ) : (
        <div className="comment-text">{comment.text}</div>
      )}

      <div className="replies-container">
        {comment.replies &&
          Object.values(comment.replies).map((reply) => (
            <div key={reply.id} className="reply">
              <div className="reply-header">
                <span className="timestamp">{formatTime(reply.timestamp)}</span>
                <div className="reply-controls">
                  <button
                    className="edit-button"
                    onClick={() => startEditing(reply.id, reply.text)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteReply(reply.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {editingId === reply.id ? (
                <div className="edit-container">
                  <textarea
                    id={`edit-${reply.id}`}
                    value={editText}
                    onChange={(e) =>
                      handleTextareaChange(e, debouncedSetEditText)
                    }
                    onFocus={handleTextareaFocus}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="edit-actions">
                    <button onClick={cancelEditing}>Cancel</button>
                    <button onClick={() => saveEdit(reply.id, true)}>
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="reply-text">{reply.text}</div>
              )}
            </div>
          ))}
      </div>

      <form onSubmit={handleSubmitReply} className="reply-form">
        <textarea
          ref={replyTextareaRef}
          placeholder="Add a reply..."
          value={replyText}
          onChange={(e) => handleTextareaChange(e, debouncedSetReplyText)}
          onFocus={handleTextareaFocus}
          onClick={(e) => e.stopPropagation()}
          required
        />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
};

export default CommentPopup;
