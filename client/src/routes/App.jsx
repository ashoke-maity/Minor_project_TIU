import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/others/Login'
import Register from '../components/others/Register'
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';
import AdminLayout from '../components/layout/AdminLayout';
import AllUsers from '../pages/AllUsers';
import UserSettings from '../pages/userSettings';

// const adminRoute = import.meta.env.ALUMNI_CONNECT_ADMIN_ROUTE;

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/dashboard" element={<UserSettings/>} />
      {/* <Route path = {`/${adminRoute}`} element={<AdminLogin/>} /> */}
    </Routes>
    <Routes>
    <Route path="/adminlogin" element={<AdminLogin/>} />
    <Route path="/admin" element={<AdminDashboard/>} />
    <Route path="/users" element={<AllUsers/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App