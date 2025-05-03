import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/others/Login';
import Register from '../components/others/Register';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';
import AdminRegister from '../pages/AdminRegister';
import UserSettings from '../pages/UserSettings';
import AllUsers from '../pages/AllUsers';

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<UserSettings />} />

        {/* Admin Routes */}
        <Route path={`${adminRoute}/admin/login`} element={<AdminLogin />} />
        <Route path={`${adminRoute}/admin/register`} element={<AdminRegister />} />
        <Route path={`${adminRoute}/admin/dashboard`} element={<AdminDashboard />} />
        <Route path={`${adminRoute}/admin/dashboard/allusers`} element={<AllUsers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
