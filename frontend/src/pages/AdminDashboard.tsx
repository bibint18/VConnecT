
import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';

export default function AdminDashboardd() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16 bg-white">
        <Sidebar />
        <h1 className='mt-[228px] ml-[403px] !text-2xl'>Welcome to the Admin Dashboard</h1>
      </div>
     
    </div>
     
  );
}

