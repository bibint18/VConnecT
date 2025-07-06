import SubscriptionPlans from '../components/admin/plans/Plans';
import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';

export default function AdminPlans() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16 ">
        <Sidebar />
        <SubscriptionPlans/>
      </div>
    </div>
  );
}



