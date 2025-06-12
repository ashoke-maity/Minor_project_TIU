import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from '../pages/Home';
import Login from '../components/others/Login';
import UserSettings from "../components/layout/UserSettings";
import Network from '../pages/Network';
import UserProfile from '../pages/UserProfile';
import EditProfile from '../pages/EditProfile';
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
import SavedPosts from '../components/Home/web/SavedPosts';
import GetEvents from '../components/Home/web/GetEvents';
import GetJobs from '../components/Home/web/GetJobs';
import ChatBot from '../components/chatbot/ChatBot';

const adminRoute = import.meta.env.VITE_ADMIN_ROUTE;


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

// Separate component to use router hooks
function AppContent() {
  // Using the current location from React Router
  const location = useLocation();
  
  // Determine if the current route is an admin route
  const isAdminRoute = location.pathname.includes('/admin');
  
  // Hide chatbot on all sign-in related pages
  const isAuthPage = location.pathname === '/' || 
                    location.pathname.includes('/login') || 
                    location.pathname.includes('/forgotpass') || 
                    location.pathname.includes('/reset-password') || 
                    location.pathname.includes('/register');

  return (
    <>
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
      
      {/* Only show the chatbot on user routes (not admin routes or any auth-related pages) */}
      {!isAdminRoute && !isAuthPage && <ChatBot />}
      
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/network" element={<Network />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/saved-posts" element={<SavedPosts />} />
        <Route path="/get-events" element={<GetEvents />} />
        <Route path="/get-jobs" element={<GetJobs />} />
        <Route path="/my-posts" element={<MyPosts />} />
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
    </>
  );
}

export default App;