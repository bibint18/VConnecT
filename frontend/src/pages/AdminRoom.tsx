import Header from '../components/admin/header/Header';
import Sidebar from '../components/admin/sidebar/Sidebar';
import RoomlistAdmin from '@/components/admin/Room/RoomListAdmin';

export default function AdminRoom() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16 ">
        <Sidebar />
        <RoomlistAdmin/>
      </div>
    </div>
  );
}