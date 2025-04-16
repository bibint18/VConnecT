import AdminRewardsList from './RewardListing';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';

export default function AdminRewardPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16 ">
        <Sidebar />
        <AdminRewardsList/>
      </div>
    </div>
  );
}



