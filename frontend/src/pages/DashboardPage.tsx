
import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';
import AdminDashboardd from '@/components/admin/Dashboardd/AdminDashboard';

export default function DashboardPageAdmin() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16 ">
        <Sidebar />
        <AdminDashboardd/>
      </div>
    </div>
  );
}



