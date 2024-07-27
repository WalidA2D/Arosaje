import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import About from './pages/about/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />
        <Route path="/about" element={<About/>} />
      </Routes>
    </Router>
  );
}

export default App;
