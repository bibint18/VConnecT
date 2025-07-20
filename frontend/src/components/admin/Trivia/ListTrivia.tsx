"use client";
import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useDeleteTriviaQuestion,
  useTriviaQuestion,
} from "@/hooks/useAdminTrivia";
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
  const limit = 5;

  const {
    data = { questions: [], total: 0 },
    isLoading,
    isError,
  } = useTriviaQuestion(page, limit, searchTerm);
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
          onSuccess: () =>
            Swal.fire(
              "Deleted!",
              "Trivia question has been deleted.",
              "success"
            ),
          onError: () =>
            Swal.fire("Error!", "Failed to delete trivia question.", "error"),
        });
      }
    });
  };

  if (isLoading)
    return <div className="text-center py-12">Loading trivia questions...</div>;
  if (isError)
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load trivia questions...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex-1">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <AdminSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
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
                <th className="rounded-tl-lg px-4 py-3 text-left text-sm">
                  S. No
                </th>
                <th className="px-4 py-3 text-left text-sm">Set Number</th>
                <th className="px-4 py-3 text-left text-sm">Question</th>
                <th className="px-4 py-3 text-left text-sm">Correct Answer</th>
                <th className="rounded-tr-lg px-4 py-3 text-left text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.questions.length > 0 ? (
                data.questions.map((trivia: Trivia, index: number) => (
                  <tr
                    key={trivia._id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 hover:-translate-y-[2px] transition-all duration-200"
                  >
                    <td className="px-4 py-3 font-bold">
                      {(page - 1) * limit + index + 1}
                    </td>
                    <td className="px-4 py-3">{trivia.setNumber}</td>
                    <td className="px-4 py-3">{trivia.question}</td>
                    <td className="px-4 py-3">{trivia.correctAnswer}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                          onClick={() =>
                            navigate(`/admin/trivia/edit/${trivia._id}`)
                          }
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
                    No trivia questions found. Try adjusting your search or add
                    a new question.
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
  );
}
