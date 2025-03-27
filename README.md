# Image Annotation Tool

An interactive image annotation tool built with React.js that allows users to upload images, add comments at specific points, and maintain threaded discussions.

## Features

- **Image Upload & Display**: Upload multiple images and switch between them
- **Click-to-Comment**: Click anywhere on an image to add comments
- **Comment Threads & Replies**: Support for nested replies in comments
- **Persistent Storage**: All comments and images are saved to localStorage
- **Sidebar Navigation**: Easily browse and jump to comments

## Technologies Used

- React.js for UI components
- Zustand for state management
- React Router for navigation
- LocalStorage for data persistence

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/image-annotation-tool.git
cd image-annotation-tool
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Project Structure

```
src/
├── components/         # React components
│   ├── AnnotationTool.jsx    # Main application wrapper
│   ├── CommentMarker.jsx     # Visual markers on the image
│   ├── CommentPopup.jsx      # Comment and reply interface
│   ├── CommentSidebar.jsx    # Sidebar listing all comments
│   ├── ImageCanvas.jsx       # Image display with annotation capabilities
│   └── ImageUploader.jsx     # Image upload interface
├── store/              # State management
│   └── store.js        # Zustand store configuration
├── App.jsx             # Application root
└── index.js            # Entry point
```

## Deployment

### Deploying to Netlify

1. Create a production build:
```bash
npm run build
```

2. Deploy to Netlify using the Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy
```

3. Follow the prompts to deploy the `build` directory.

4. Once satisfied with the preview, deploy to production:
```bash
netlify deploy --prod
```

### Deploying to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. Follow the prompts to complete the deployment.

## Future Enhancements

- User authentication
- Cloud storage for images and comments
- Rich text formatting in comments
- Export annotations as CSV/JSON
- Group collaboration features

## License

MIT
