import { Sidebar } from "./Sidebar"
import { ProfileContent } from "./ProfileForm"
import Header from "../Header/Header"

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header: Fixed at the top */}
      <div className="fixed top-0 left-0 w-full z-10">
        <Header />
      </div>

      {/* Main content: Flex row to handle Sidebar and ProfileContent */}
      <div className="flex flex-1">
        {/* Sidebar: Fixed on the left, starts below the header */}
        <Sidebar />

        {/* ProfileContent: Takes remaining space */}
        <div className="flex-1 pt-16"> {/* pt-16 offsets for header height */}
          <ProfileContent />
        </div>
      </div>
    </div>
  )
}

