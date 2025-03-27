import React, { useRef } from 'react';
import { useStore } from '../store/store';
// import './ImageUploader.css';

const ImageUploader = () => {
  const fileInputRef = useRef(null);
  const { images, addImage, setCurrentImageId, currentImageId, switchImage } =
    useStore();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (!file.type.match('image.*')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageId = `img_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        addImage(imageId, {
          id: imageId,
          src: event.target.result,
          name: file.name,
          comments: {},
        });

        // Set as current image if this is the first one
        if (!currentImageId) {
          setCurrentImageId(imageId);
        }
      };

      reader.readAsDataURL(file);
    });

    // Clear the input to allow uploading the same file again
    e.target.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="file-input"
      />

      <button className="upload-button" onClick={triggerFileInput}>
        Upload Images
      </button>

      <div className="image-thumbnails">
        {Object.values(images).map((image) => (
          <div
            key={image.id}
            className={`thumbnail ${
              currentImageId === image.id ? 'active' : ''
            }`}
            onClick={() => switchImage(image.id)}
          >
            <img src={image.src} alt={image.name} />
            <span className="image-name">{image.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
