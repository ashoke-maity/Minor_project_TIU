import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from '../pages/Home';
import Login from '../components/others/Login';
import UserSettings from "../components/layout/UserSettings";
import UserPrivacyPolicy from '../pages/UserPrivacyPolicy';
import UserJobPortal from '../pages/UserJobPortal';
import Network from '../pages/Network';
import AdminDashboard from '../pages/AdminDashboard';
import AdminSettings from '../components/admin/AdminSettings';
import AdminLogin from '../pages/AdminLogin';
import AdminForgotPass from '../pages/AdminForgotPass';
import AdminResetPassword from '../pages/AdminResetPass';
import AdminRegister from '../pages/AdminRegister';
import AdminEvents from '../pages/AdminEvents';
import AdminStories from '../pages/AdminStories';
import AdminJobPosting from '../pages/AdminJobPosting';
import AdminNewEvent from '../pages/AdminNewEvent';
import AdminDonations from '../pages/AdminDonations';
import AdminNewJobs from '../pages/AdminNewJobs';
import AdminNewStories from '../pages/AdminNewStories';
import NotFound from '../pages/NotFound';
import MyPosts from "../pages/MyPosts";

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;


function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/network" element={<Network />} />
        <Route path="settings" element={<UserSettings />} />
        <Route path="/privacypolicy" element={<UserPrivacyPolicy />} />
        
        {/* Admin Routes */}
        <Route path={`${adminRoute}/admin/login`} element={<AdminLogin />} />
        <Route path={`${adminRoute}/admin/forgotpass`} element={<AdminForgotPass />} />
        <Route path={`/admin/reset-password/:token`} element={<AdminResetPassword />} />
        <Route path={`${adminRoute}/admin/register`} element={<AdminRegister />} />
        <Route path={`${adminRoute}/admin/dashboard`} element={<AdminDashboard />} />
        <Route path={`${adminRoute}/admin/dashboard/settings`} element={<AdminSettings />} />
        <Route path={`${adminRoute}/admin/dashboard/events`} element={<AdminEvents />} />
        <Route path={`${adminRoute}/admin/dashboard/addEvents`} element={<AdminNewEvent />} />
        <Route path={`${adminRoute}/admin/dashboard/jobs`} element={<AdminJobPosting />} />
        <Route path={`${adminRoute}/admin/dashboard/addJobs`} element={<AdminNewJobs />} />
        <Route path={`${adminRoute}/admin/dashboard/stories`} element={<AdminStories />} />
        <Route path={`${adminRoute}/admin/dashboard/addStories`} element={<AdminNewStories />} />
        <Route path={`${adminRoute}/admin/dashboard/donations`} element={<AdminDonations />} />

        {/* My Posts */}
        <Route path="/my-posts" element={<MyPosts />} />

        {/* not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
