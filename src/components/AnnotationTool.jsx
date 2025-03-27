import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/store';
import ImageUploader from './ImageUploader';
import ImageCanvas from './ImageCanvas';
import CommentSidebar from './CommentSidebar';
// import './AnnotationTool.css';

const AnnotationTool = () => {
  const { images, setImages, setCurrentImageId, currentImageId } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Load data from localStorage on component mount
    const savedData = localStorage.getItem('annotation-tool-data');
    if (savedData) {
      const { images, currentImageId } = JSON.parse(savedData);
      setImages(images);
      if (currentImageId && images[currentImageId]) {
        setCurrentImageId(currentImageId);
      } else if (Object.keys(images).length > 0) {
        setCurrentImageId(Object.keys(images)[0]);
      }
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever state changes
    localStorage.setItem(
      'annotation-tool-data',
      JSON.stringify({
        images,
        currentImageId,
      })
    );
  }, [images, currentImageId]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="annotation-tool">
      <header className="annotation-header">
        <h1>Image Annotation Tool</h1>
        <div className="header-actions">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? 'Hide' : 'Show'} Comments
          </button>
        </div>
      </header>

      <div className="tool-container">
        <main
          className={`annotation-main ${sidebarOpen ? 'with-sidebar' : ''}`}
        >
          <ImageUploader />

          {currentImageId ? (
            <ImageCanvas />
          ) : (
            <div className="empty-state">
              <p>Upload an image to get started</p>
            </div>
          )}
        </main>

        {sidebarOpen && <CommentSidebar />}
      </div>
    </div>
  );
};

export default AnnotationTool;
