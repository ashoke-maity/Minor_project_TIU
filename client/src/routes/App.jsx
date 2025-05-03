import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/others/Login'
import Register from '../components/others/Register'
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';
// import AdminLayout from '../components/layout/AdminLayout';
// import AllUsers from '../pages/admin/admin/AllUsers';
import UserSettings from '../pages/userSettings';
const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;

function App() {
  return (
    <BrowserRouter>
    <Routes>
      {/* user routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/dashboard" element={<UserSettings/>} />
    </Routes>

    {/* admin routes */}
    <Routes>
    <Route path={`${adminRoute}/admin/login`} element={<AdminLogin/>} />
    <Route path={`${adminRoute}/admin/dashboard`} element={<AdminDashboard/>} />
    {/* <Route path="/users" element={<AllUsers/>} /> */}
    </Routes>
  </BrowserRouter>
  )
}

export default App