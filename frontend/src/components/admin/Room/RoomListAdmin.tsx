
"use client"

import { useState } from "react"
import { Search, ChevronDown, BarChart2,ScanSearch, ChevronRight, ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useRooms,useBlockRoom,useUnblockRoom} from "../../../hooks/useRooms"
import Swal from "sweetalert2";
import { Room } from "@/api/adminAuth";
export default function RoomlistAdmin() {
  const [page,setPage] = useState(1)
  const limit=6
    const [searchTerm,setSearchTerm] = useState('')
  const [sortOption,setSortOption] = useState<string>('all')
  const navigate = useNavigate()
  const blockMutation = useBlockRoom(page,limit,searchTerm,sortOption)
  const unblockMutation = useUnblockRoom(page,limit,searchTerm,sortOption)
  // const deleteMutation = useDeleteRoom()
  const { data, isLoading, isError } = useRooms(page, limit, searchTerm, sortOption);
  const rooms: Room[] = data?.rooms ?? []; 
  const totalRooms: number = data?.totalRooms ?? 0; 
const totalPages = Math.ceil(totalRooms/limit)
  const handleBlock = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to block this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Block",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        blockMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire("Blocked!", "The user has been blocked.", "success");
          },
          onError: () => {
            Swal.fire("Error!", "Something went wrong.", "error");
          },
        });
      }
    });
  };
  const handleUnblock = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to unblock this user?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Unblock",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        unblockMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire("Unblocked!", "The user has been unblocked.", "success");
          },
          onError: () => {
            Swal.fire("Error!", "Something went wrong.", "error");
          },
        });
      }
    });
  };

  const handleViewDetails = (id: string) => {
    navigate(`/admin/room-details/${id}`);
  };



  if(isLoading) return <p>Loading Rooms...</p>
  if(isError) return <p>Error fetching Rooms..</p>
  return (
    <div className="customer-dashboard flex-1">
      {/* <div className="container"> */}
        <div className="grid-layout">
          <div>
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="search-container text-black">
                <input
                  type="text"
                  placeholder="Search users here"
                  className="search-input !text-black "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  //venenkile refetch
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
              </div>

              <div className="sort-options">
                <div className="sort-item">
                  <BarChart2 className="h-5 w-5 text-orange-500" />
                  <span>Sort By</span>
                </div>
                <div className="sort-item">
                  <select className="outline-none"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  >
                    <ChevronDown className="h-4 w-4" />
                    <option className="text-black" value="all">ALL</option>
                    <option className="text-black" value="public">PUBLIC</option>
    <option className="text-black " value="private">PRIVATE</option>
    {/* <option className="text-black " value="recent">Premium</option> */}
                  </select>
                </div>

                {/* <div className="sort-item">
                  <BarChart2 className="h-5 w-5 text-orange-500" />
                  <span>Points</span>
                </div> */}
                {/* <div className="sort-item">
                  <span>Streaks</span>
                </div> */}
              </div>
            </div>

            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="rounded-tl-lg px-4 py-3 text-left text-sm">S. Number</th>
                    <th className="px-4 py-3 text-left text-sm">Name</th>
                    <th className="px-4 py-3 text-left text-sm">createdBy</th>
                    <th className="px-4 py-3 text-left text-sm">Type</th>
                    <th className="px-4 py-3 text-left text-sm">Limit</th>
                    <th className="px-4 py-3 text-left text-sm">Live</th>
                    <th className="px-4 py-3 text-left text-sm">Status</th>
                    <th className="rounded-tr-lg px-4 py-3 text-left text-sm">Update</th>
                  </tr>
                </thead>
                <tbody>
                
                {rooms?.length > 0 ? ( rooms?.map((room: Room,index:number) => (
                    <tr key={room._id} className="table-row border-b border-gray-100 last:border-0">
                        <td className="px-4 py-3">
                          <span className="font-bold">{index + 1}</span>
                        </td>
                        <td className="px-4 py-3">{room.title}</td>
                        <td className="px-4 py-3">{(room.createdBy as any)?.name || "Unknown"}</td>
                        <td className="px-4 py-3">{room.type}</td>
                        <td className="px-4 py-3">{room.limit}</td>
                        <td className="px-4 py-3">{room.participants.length}</td>
                        <td className="px-4 py-3">
                          {room.isBlocked ? (
                            <button
                              onClick={() => handleUnblock(room._id)}
                              className="status-button status-unblocked bg-green-500 text-white px-2 py-1 rounded"
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlock(room._id)}
                              className="status-button status-blocked bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Block
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewDetails(room._id)}
                            className="action-button delete-button"
                          >
                            <ScanSearch className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                  ))): (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>


            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="page-button">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-2">{page}</span>
              <button disabled={page >= totalPages} 
    onClick={() => setPage((prev) => prev + 1)} 
    className="page-button">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>

          
        </div>
      {/* </div> */}
    </div>
  )
}