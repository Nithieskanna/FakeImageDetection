import Upload from './components/Upload.js';
import Review from './components/Review.js';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Upload />} />
        <Route exact path="/review" element={<Review />} />
      </Routes>
    </Router>
  );
}

export default App;
