import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import Chemistry from './pages/Chemistry';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/chemistry" element={<Chemistry />} />
        <Route path="/subscriptions" element={<Index />} />
      </Routes>
    </Router>
  );
}

export default App;