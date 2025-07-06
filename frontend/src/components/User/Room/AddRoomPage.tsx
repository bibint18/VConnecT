import { Sidebar } from "../Profile/Sidebar"
import Header from "../Header/Header"
import AddRoom from "./AddRoom"

export default function AddRoomPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full z-10">
        <Header />
      </div>
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 pt-16"> 
          <AddRoom />
        </div>
      </div>
    </div>
  )
}