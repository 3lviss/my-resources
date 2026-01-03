import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resources } from "../lib/api";

interface Resource {
  id: string;
  title: string;
  type: string;
  url: string | null;
  description: string;
  use_case: string | null;
  created_at: string;
}

interface PaginatedResponse {
  items: Resource[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [resourceList, setResourceList] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 1, per_page: 10 });

  const fetchResources = async (currentPage: number) => {
    setLoading(true);
    try {
      const data = await resources.getAll(currentPage);
      if (data.status_code === 200) {
        const paginatedData = data.data as PaginatedResponse;
        setResourceList(paginatedData.items);
        setMeta({
          total: paginatedData.total,
          total_pages: paginatedData.total_pages,
          per_page: paginatedData.per_page,
        });
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources(page);
  }, [page]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-500 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Resources</h2>
            <button
              onClick={() => console.log("Create new resource")}
              className="px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-500 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Resource
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : resourceList.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No resources found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">Title</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">Type</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">Description</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">URL</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">Created</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {resourceList.map((resource) => (
                    <tr key={resource.id} className="hover:bg-gray-750">
                      <td className="px-4 py-3 text-white font-medium">{resource.title}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs rounded bg-indigo-600 text-white capitalize">
                          {resource.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 max-w-xs truncate">{resource.description}</td>
                      <td className="px-4 py-3">
                        {resource.url ? (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                          >
                            Link
                          </a>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">
                        {new Date(resource.created_at).toLocaleString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => console.log("Edit", resource.id)}
                            className="p-2 text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => console.log("Delete", resource.id)}
                            className="p-2 text-red-400/70 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {meta.total_pages > 1 && (
            <div className="p-4 border-t border-gray-700 flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                Showing {(page - 1) * meta.per_page + 1} - {Math.min(page * meta.per_page, meta.total)} of {meta.total}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Previous
                </button>
                {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                      p === page
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === meta.total_pages}
                  className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
