import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resources } from "../../lib/api";
import Layout from "../../layouts/Layout";
import Button from "../../components/Button";
import Toast from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";
import ResourcesTable from "../../components/Datatable";
import Pagination from "../../components/Pagination";
import Filter from "../../components/Filter";
import SearchInput from "../../components/SearchInput";

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
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [types, setTypes] = useState<{ label: string; value: string }[]>([]);
  const [meta, setMeta] = useState({ total: 0, total_pages: 1, per_page: 10 });
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchResources = async (currentPage: number, type?: string, search?: string) => {
    setLoading(true);
    try {
      const data = await resources.getAll(currentPage, type, search);
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
    const fetchTypes = async () => {
      try {
        const response = await resources.getTypes();
        if (response.status_code === 200 && response.data) {
          const typeOptions = response.data.map((type) => ({
            label: type.charAt(0).toUpperCase() + type.slice(1),
            value: type,
          }));
          setTypes(typeOptions);
        }
      } catch (error) {
        console.error("Failed to fetch resource types:", error);
      }
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [selectedType, debouncedSearch]);

  useEffect(() => {
    fetchResources(page, selectedType, debouncedSearch || undefined);
  }, [page, selectedType, debouncedSearch]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const response = await resources.delete(deleteTarget.id);
      if (response.status_code === 200) {
        setToast({ message: "Resource deleted successfully", type: "success" });
        fetchResources(page, selectedType, debouncedSearch || undefined);
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
      <div className="flex flex-col gap-4">
        {/* Modern Toolbar - Responsive */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 flex flex-col lg:flex-row lg:items-center gap-3 p-3 lg:px-4 lg:py-2">
          {/* Row 1 (Mobile) / Item 1 (Desktop): Title + Mobile Button */}
          <div className="flex items-center justify-between lg:flex-none gap-3">
            <h2 className="text-lg font-semibold text-white whitespace-nowrap">Resources</h2>

            {/* Divider - Hidden on Mobile */}
            <div className="hidden lg:block w-px h-6 bg-gray-700"></div>

            {/* Mobile Button - Hidden on Desktop */}
            <Button
              onClick={() => navigate("/resources/new")}
              size="md"
              className="flex lg:hidden items-center gap-2 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Resource
            </Button>
          </div>

          {/* Row 2 (Mobile) / Item 2 (Desktop): Search Input */}
          <SearchInput
            placeholder="Search resources by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onClear={() => setSearchInput("")}
          />

          {/* Row 3 (Mobile) / Item 3 (Desktop): Filter */}
          <Filter
            value={selectedType}
            options={types}
            onChange={setSelectedType}
            placeholder="All Types"
          />

          {/* Spacer - Desktop only */}
          <div className="hidden lg:flex flex-1"></div>

          {/* Desktop Button - Hidden on Mobile */}
          <Button
            onClick={() => navigate("/resources/new")}
            size="md"
            className="hidden lg:flex items-center gap-2 whitespace-nowrap h-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Resource
          </Button>
        </div>

        {/* Data Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
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
