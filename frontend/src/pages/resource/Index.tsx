import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resources } from "../../lib/api";
import Layout from "../../layouts/Layout";
import Toast from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";
import ResourcesTable from "../../components/Datatable";
import Pagination from "../../components/Pagination";

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

export default function Index() {
  const navigate = useNavigate();
  const [resourceList, setResourceList] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, total_pages: 1, per_page: 10 });
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const response = await resources.delete(deleteTarget.id);
      if (response.status_code === 200) {
        setToast({ message: "Resource deleted successfully", type: "success" });
        fetchResources(page);
      } else {
        setToast({ message: response.message || "Failed to delete resource", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to delete resource", type: "error" });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Resources</h2>
          <button
            onClick={() => navigate("/resources/new")}
            className="px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-500 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Resource
          </button>
        </div>

        <ResourcesTable
          resources={resourceList}
          loading={loading}
          onEdit={(resource) => navigate(`/resources/${resource.id}`)}
          onDelete={(resource) => setDeleteTarget(resource)}
        />

        <Pagination
          page={page}
          totalPages={meta.total_pages}
          perPage={meta.per_page}
          total={meta.total}
          onPageChange={setPage}
        />
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Resource"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleting}
        />
      )}
    </Layout>
  );
}
