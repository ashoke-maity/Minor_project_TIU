import { useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import AdminStats, { dashboardStats } from "../components/admin/AdminStats";
import RecentEvents from "../components/admin/RecentEvents";
import AlumniList from "../components/admin/AlumniList";
import MobileSidebar from "../components/admin/MobileSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import Header from "../components/admin/Header";

function AdminDashboard() {
  const navigate = useNavigate();

  const user = { name: 'Jordan'}

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("isAdmin");
//     if (!isAdmin) {
//       navigate("/admin-login");
//     }
//   }, [navigate]);

  return (
    <main className="admin-layout bg-gray-50 min-h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className='dashboard wrapper mt-5 content-center'>
        <header className="header">
          <article>
          <Header 
            title={`Welcome ${user?.name ?? 'Guest'} 👋`}
            description="Track Activity, Trends and popular destinations in real time"
        />
          </article>
        </header>
        <AdminStats />
    </main>
    </main>
  );
}

export default AdminDashboard;
