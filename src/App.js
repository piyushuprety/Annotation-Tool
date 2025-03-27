import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnnotationTool from './components/AnnotationTool';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AnnotationTool />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
