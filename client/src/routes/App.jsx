import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/others/Login';
import Register from '../components/others/Register';
import UserSettings from '../pages/userSettings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />}/>
        <Route path="/dashboard" element={<UserSettings/>} />
      </Routes>
    </Router>
  );
}

export default App