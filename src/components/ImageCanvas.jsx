import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/store';
import CommentPopup from './CommentPopup';
import CommentMarker from './CommentMarker';
// import './ImageCanvas.css';

const ImageCanvas = () => {
  const {
    images,
    currentImageId,
    addComment,
    setActiveComment,
    activeCommentId,
  } = useStore();

  const [newCommentPosition, setNewCommentPosition] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);

  const currentImage = images[currentImageId];
  const currentComments = currentImage ? currentImage.comments : {};

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.offsetWidth,
          height: canvasRef.current.offsetHeight,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [currentImageId]);

  // Modified click handler with improved event handling
  const handleClickOutside = (e) => {
    // Check if the click is directly on the canvas or an element that should close the popup
    const clickedOnCanvas =
      e.target === canvasRef.current ||
      e.target.classList.contains('annotation-image');
    const clickedOnPopup = e.target.closest('.comment-popup');
    const clickedOnMarker = e.target.closest('.comment-marker');

    // Only close popup if clicked on canvas directly (not on popup or marker)
    if (clickedOnCanvas && !clickedOnPopup && !clickedOnMarker) {
      setActiveComment(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setActiveComment]);

  const handleCanvasClick = (e) => {
    // Don't create comment if clicked on existing comment or popup
    if (
      e.target.closest('.comment-marker') ||
      e.target.closest('.comment-popup')
    ) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setNewCommentPosition({ x, y });
    setActiveComment(null);
  };

  const handleAddComment = (text) => {
    if (newCommentPosition && text.trim()) {
      const commentId = `comment_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      addComment(currentImageId, commentId, {
        id: commentId,
        position: newCommentPosition,
        text,
        timestamp: new Date().toISOString(),
        replies: {},
      });

      setNewCommentPosition(null);
      setActiveComment(commentId);
    } else {
      setNewCommentPosition(null);
    }
  };

  const cancelNewComment = () => {
    setNewCommentPosition(null);
  };

  if (!currentImage) return null;

  return (
    <div className="image-canvas-container">
      <div className="image-canvas" ref={canvasRef} onClick={handleCanvasClick}>
        <img
          src={currentImage.src}
          alt={currentImage.name}
          className="annotation-image"
        />

        {/* Render existing comment markers */}
        {Object.values(currentComments).map((comment) => (
          <CommentMarker
            key={comment.id}
            comment={comment}
            isActive={activeCommentId === comment.id}
          />
        ))}

        {/* Render new comment popup if position exists */}
        {newCommentPosition && (
          <CommentPopup
            position={newCommentPosition}
            onSubmit={handleAddComment}
            onCancel={cancelNewComment}
            isNew={true}
          />
        )}

        {/* Render active comment popup */}
        {activeCommentId && currentComments[activeCommentId] && (
          <CommentPopup
            comment={currentComments[activeCommentId]}
            position={currentComments[activeCommentId].position}
            isNew={false}
          />
        )}
      </div>
    </div>
  );
};

export default ImageCanvas;
