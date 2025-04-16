
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import AddReward from './AddRewardForm';

export default function AddRewardPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16 ">
        <Sidebar />
        <AddReward/>
      </div>
    </div>
  );
}



