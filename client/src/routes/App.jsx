import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../components/others/Login';
import Register from '../components/others/Register';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';
import AdminRegister from '../pages/AdminRegister';
import UserSettings from '../pages/UserSettings';
import AllUsers from '../pages/AdminAllUsers';
import AdminEvents from '../pages/AdminEvents';
import AdminStories from '../pages/AdminStories';
import AdminJobPosting from '../pages/AdminJobPosting';
import AdminNewEvent from '../pages/AdminNewEvent';
import AdminDonations from '../pages/AdminDonations';
import AdminNewJobs from '../pages/AdminNewJobs';
import AdminNewStories from '../pages/AdminNewStories';

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
        <Route path={`${adminRoute}/admin/dashboard/events`} element={<AdminEvents />} />
        <Route path={`${adminRoute}/admin/dashboard/addEvents`} element={<AdminNewEvent />} />
        <Route path={`${adminRoute}/admin/dashboard/jobs`} element={<AdminJobPosting />} />
        <Route path={`${adminRoute}/admin/dashboard/addJobs`} element={<AdminNewJobs />} />
        <Route path={`${adminRoute}/admin/dashboard/stories`} element={<AdminStories />} />
        <Route path={`${adminRoute}/admin/dashboard/addStories`} element={<AdminNewStories />} />
        <Route path={`${adminRoute}/admin/dashboard/donations`} element={<AdminDonations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
