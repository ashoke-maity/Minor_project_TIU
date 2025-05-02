import { useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import AdminStats from "../components/admin/AdminStats";
import RecentEvents from "../components/admin/RecentEvents";
import AlumniList from "../components/admin/AlumniList";

function AdminDashboard() {
  const navigate = useNavigate();

//   useEffect(() => {
//     const isAdmin = localStorage.getItem("isAdmin");
//     if (!isAdmin) {
//       navigate("/admin-login");
//     }
//   }, [navigate]);

  return (
    <main className="admin-layout bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, Admin</h1>
          <AdminStats />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentEvents />
            <AlumniList />
          </div>
        </main>
      </div>
    </main>
  );
}

export default AdminDashboard;
