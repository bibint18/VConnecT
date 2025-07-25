"use client";
import { useState } from "react";
import { ScanSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useRooms,
  useBlockRoom,
  useUnblockRoom,
} from "../../../hooks/useRooms";
import Swal from "sweetalert2";
import { Room } from "@/api/adminAuth";
import AdminSearchBar from "../Controls/AdminSearchBar";
import SortFilter from "../Controls/AdminSortFilter";
import AdminPagination from "../Controls/AdminPagination";

export default function RoomlistAdmin() {
  const [page, setPage] = useState(1);
  const limit = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<string>("all");
  const navigate = useNavigate();
  const blockMutation = useBlockRoom(page, limit, searchTerm, sortOption);
  const unblockMutation = useUnblockRoom(page, limit, searchTerm, sortOption);
  const { data, isLoading, isError } = useRooms(
    page,
    limit,
    searchTerm,
    sortOption
  );
  const rooms: Room[] = data?.rooms ?? [];
  const totalRooms: number = data?.totalRooms ?? 0;
  const totalPages = Math.ceil(totalRooms / limit);
  const RoomSortOptions = [
    { value: "all", label: "ALL" },
    { value: "public", label: "PUBLIC" },
    { value: "private", label: "PRIVATE" },
  ];
  const handleBlock = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to block this room?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Block",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        blockMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire("Blocked!", "The room has been blocked.", "success");
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
      text: "Do you want to unblock this room?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Unblock",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        unblockMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire("Unblocked!", "The room has been unblocked.", "success");
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

  if (isLoading) return <p className="text-center py-12">Loading rooms...</p>;
  if (isError)
    return (
      <p className="text-center py-12 text-red-500">Error fetching rooms...</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex-1">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
          <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <AdminSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <SortFilter
                sortOption={sortOption}
                setSortOption={setSortOption}
                options={RoomSortOptions}
              />
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-orange-50 text-gray-600 font-semibold">
                    <th className="rounded-tl-lg px-4 py-3 text-left text-sm">
                      S. Number
                    </th>
                    <th className="px-4 py-3 text-left text-sm">Name</th>
                    <th className="px-4 py-3 text-left text-sm">Created By</th>
                    <th className="px-4 py-3 text-left text-sm">Type</th>
                    <th className="px-4 py-3 text-left text-sm">Limit</th>
                    <th className="px-4 py-3 text-left text-sm">Status</th>
                    <th className="rounded-tr-lg px-4 py-3 text-left text-sm">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rooms?.length > 0 ? (
                    rooms?.map((room: Room, index: number) => (
                      <tr
                        key={room._id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50 hover:-translate-y-[2px] transition-all duration-200"
                      >
                        <td className="px-4 py-3">
                          <span className="font-bold">{index + 1}</span>
                        </td>
                        <td className="px-4 py-3">{room.title}</td>
                        <td className="px-4 py-3">
                          {room.createdByName || "Unknown"}
                        </td>
                        <td className="px-4 py-3">{room.type}</td>
                        <td className="px-4 py-3">{room.limit}</td>
                        <td className="px-4 py-3">
                          {room.isBlocked ? (
                            <button
                              onClick={() => handleUnblock(room._id)}
                              className="w-[100px] h-8 rounded-lg bg-red-500 text-white font-medium text-sm uppercase tracking-wide hover:bg-red-600 hover:-translate-y-[1px] transition-all duration-300 shadow-sm"
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlock(room._id)}
                              className="w-[100px] h-8 rounded-lg bg-green-500 text-white font-medium text-sm uppercase tracking-wide hover:bg-green-600 hover:-translate-y-[1px] transition-all duration-300 shadow-sm"
                            >
                              Block
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewDetails(room._id)}
                            className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                          >
                            <ScanSearch className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-gray-500"
                      >
                        No rooms found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <AdminPagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
