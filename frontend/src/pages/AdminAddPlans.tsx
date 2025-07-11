
import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';
import AddPlan from '../components/admin/plans/AddPlan';

export default function AdminAddPlan() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16 ">
        <Sidebar />
        <AddPlan/>
      </div>
    </div>
  );
}
