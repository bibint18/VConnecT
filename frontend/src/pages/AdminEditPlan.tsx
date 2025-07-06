
import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';
import EditPlan from '../components/admin/plans/EditPlans';

export default function AdminEditPlan() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16 ">
        <Sidebar />
        <EditPlan/>       
      </div>
    </div>
  );
}
