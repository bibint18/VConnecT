import { Sidebar } from "../Profile/Sidebar"
import Header from "../Header/Header"
import FriendRequests from "./FriendRequest"

export default function FriendRequestPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="fixed top-0 left-0 w-full z-10">
        <Header />
      </div>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-20 md:ml-64 pt-16">
          <FriendRequests/>
        </main>
      </div>
    </div>
  )
}