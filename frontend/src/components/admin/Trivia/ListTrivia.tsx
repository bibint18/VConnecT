// import { useState } from "react";
// import { Search, Edit, Trash2 } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useDeleteTriviaQuestion, useTriviaQuestion } from "@/hooks/useAdminTrivia";
// import Swal from "sweetalert2";
// import { ChevronRight, ChevronLeft } from "lucide-react";
// import "./triviaList.css"; 

// interface Trivia {
//   _id: string;
//   setNumber: number;
//   question: string;
//   correctAnswer: string;
//   isDeleted: boolean;
// }

// export default function ListTrivia() {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const limit = 4;

//   const { data = { questions: [], total: 0 }, isLoading, isError } = useTriviaQuestion(
//     page,
//     limit,
//     searchTerm
//   );
//   const totalPages = Math.ceil(data.total / limit);
//   const { mutate: deleteTrivia } = useDeleteTriviaQuestion();

//   const handleDelete = (id: string) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This trivia question will be deleted!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         deleteTrivia(id, {
//           onSuccess: () => Swal.fire("Deleted!", "Trivia question has been deleted.", "success"),
//         });
//       }
//     });
//   };

//   if (isLoading) return <div className="text-center py-12">Loading trivia questions...</div>;
//   if (isError) return <div className="text-center py-12 text-red-500">Failed to load trivia questions.</div>;

//   return (
//     <div className="trivia-list flex-1">
//       {/* <div className="container"> */}
//         <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//           {/* Search Bar */}
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Search trivia questions here"
//               className="search-input"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
//           </div>

//           {/* Sort Options */}
//           {/* <div className="sort-options">
//             <div className="sort-item">
//               <BarChart2 className="h-5 w-5 text-orange-500" />
//               <span>Sort By</span>
//             </div>
//             <div className="sort-item">
//               <select
//                 className="outline-none"
//                 value={sortOption}
//                 onChange={(e) => setSortOption(e.target.value)}
//               >
//                 <option value="setLowHigh">Set Number (Low-High)</option>
//                 <option value="setHighLow">Set Number (High-Low)</option>
//                 <option value="A-Z">Question (A-Z)</option>
//                 <option value="Z-A">Question (Z-A)</option>
//               </select>
//             </div>
//           </div> */}

         
//           <button className="add-plan-button" onClick={() => navigate("/trivia/add")}>
//             <span>Add New Trivia</span>
//           </button>
//         </div>

//         <div className="table-container">
//           <table className="w-full">
//             <thead>
//               <tr className="table-header">
//                 <th className="rounded-tl-lg px-4 py-3 text-left text-sm">S. No</th>
//                 <th className="px-4 py-3 text-left text-sm">Set Number</th>
//                 <th className="px-4 py-3 text-left text-sm">Question</th>
//                 <th className="px-4 py-3 text-left text-sm">Correct Answer</th>
//                 <th className="rounded-tr-lg px-4 py-3 text-left text-sm">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.questions.map((trivia: Trivia, index: number) => (
//                 <tr key={trivia._id} className="table-row border-b border-gray-100 last:border-0">
//                   <td className="px-4 py-3 font-bold">{(page - 1) * limit + index + 1}</td>
//                   <td className="px-4 py-3">{trivia.setNumber}</td>
//                   <td className="px-4 py-3">{trivia.question}</td>
//                   <td className="px-4 py-3">{trivia.correctAnswer}</td>
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-2">
//                       <button
//                         className="action-button edit-button"
//                         onClick={() => navigate(`/admin/trivia/edit/${trivia._id}`)}
//                       >
//                         <Edit className="h-5 w-5" />
//                       </button>
//                       <button
//                         className="action-button delete-button"
//                         onClick={() =>handleDelete(trivia._id)}
//                       >
//                         <Trash2 className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

       
//         {data.questions.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">
//               No trivia questions found. Try adjusting your search or add a new question.
//             </p>
//           </div>
//         )}

       
//         <div className="pagination">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((prev) => prev - 1)}
//             className="page-button"
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </button>
//           <span className="px-3 py-2">{page}</span>
//           <button
//             disabled={page >= totalPages}
//             onClick={() => setPage((prev) => prev + 1)}
//             className="page-button"
//           >
//             <ChevronRight className="h-4 w-4" />
//           </button>
//         </div>
//       {/* </div> */}
//     </div>
//   );
// }




"use client"

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeleteTriviaQuestion, useTriviaQuestion } from "@/hooks/useAdminTrivia";
import Swal from "sweetalert2";
import AdminSearchBar from "../Controls/AdminSearchBar";
import AdminPagination from "../Controls/AdminPagination";

interface Trivia {
  _id: string;
  setNumber: number;
  question: string;
  correctAnswer: string;
  isDeleted: boolean;
}

export default function ListTrivia() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 4;

  const { data = { questions: [], total: 0 }, isLoading, isError } = useTriviaQuestion(
    page,
    limit,
    searchTerm
  );
  const totalPages = Math.ceil(data.total / limit);
  const { mutate: deleteTrivia } = useDeleteTriviaQuestion();

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This trivia question will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTrivia(id, {
          onSuccess: () => Swal.fire("Deleted!", "Trivia question has been deleted.", "success"),
          onError: () => Swal.fire("Error!", "Failed to delete trivia question.", "error"),
        });
      }
    });
  };

  if (isLoading) return <div className="text-center py-12">Loading trivia questions...</div>;
  if (isError) return <div className="text-center py-12 text-red-500">Failed to load trivia questions...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex-1">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <AdminSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <button
            className="flex items-center bg-orange-500 text-white px-3 py-1.5 rounded-full font-medium text-sm shadow-sm hover:bg-orange-600 hover:-translate-y-[2px] transition-all duration-300"
            onClick={() => navigate("/trivia/add")}
          >
            <span>Add New Trivia</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-orange-50 text-gray-600 font-semibold">
                <th className="rounded-tl-lg px-4 py-3 text-left text-sm">S. No</th>
                <th className="px-4 py-3 text-left text-sm">Set Number</th>
                <th className="px-4 py-3 text-left text-sm">Question</th>
                <th className="px-4 py-3 text-left text-sm">Correct Answer</th>
                <th className="rounded-tr-lg px-4 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.questions.length > 0 ? (
                data.questions.map((trivia: Trivia, index: number) => (
                  <tr
                    key={trivia._id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 hover:-translate-y-[2px] transition-all duration-200"
                  >
                    <td className="px-4 py-3 font-bold">{(page - 1) * limit + index + 1}</td>
                    <td className="px-4 py-3">{trivia.setNumber}</td>
                    <td className="px-4 py-3">{trivia.question}</td>
                    <td className="px-4 py-3">{trivia.correctAnswer}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                          onClick={() => navigate(`/admin/trivia/edit/${trivia._id}`)}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                          onClick={() => handleDelete(trivia._id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No trivia questions found. Try adjusting your search or add a new question.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
}