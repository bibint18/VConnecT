
import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';
import CustomerDashboard from '../components/admin/dashboard/CustomerDashboard';

export default function AdminCustomers() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16 bg-yellow-900">
        {/* Sidebar (Positioned Below Header & Stuck to the Left) */}
        <Sidebar />
        {/* <MainContent/> */}
        <CustomerDashboard/>
        
      </div>
    </div>
  );
}
