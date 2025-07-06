
import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';
import CustomerDashboard from '../components/admin/dashboard/CustomerDashboard';

export default function AdminCustomers() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16 ">
        <Sidebar />
        <CustomerDashboard/>  
      </div>
    </div>
  );
}
