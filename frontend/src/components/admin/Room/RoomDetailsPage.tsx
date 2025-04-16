
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar';
import RoomDetails from './RoomDetails';

export default function RoomDetailsPage() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 pt-16 ">
        <Sidebar />
        <RoomDetails/>
      </div>
    </div>
  );
}



