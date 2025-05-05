import { Sidebar } from "../Profile/Sidebar"
import ListRoom from "./ListRoom"
import Header from "../Header/Header"

export default function RoomPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full z-10">
        <Header />
      </div>
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 pt-16"> 
          <ListRoom />
        </div>
      </div>
    </div>
  )
}