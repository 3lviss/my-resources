import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resources } from "../../lib/api";
import Layout from "../../layouts/Layout";
import Toast from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";

interface Resource {
  id: string;
  title: string;
  type: string;
  url: string | null;
  description: string;
  use_case: string | null;
  created_at: string;
  updated_at: string;
}

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Resource | null>(null);
  const [originalData, setOriginalData] = useState<Resource | null>(null);
  const [resourceTypes, setResourceTypes] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const [resourceResponse, typesResponse] = await Promise.all([
          resources.getById(id),
          resources.getTypes(),
        ]);

        if (resourceResponse.status_code === 200) {
          const data = resourceResponse.data as Resource;
          setFormData(data);
          setOriginalData(data);
        } else {
          setError(resourceResponse.message || "Resource not found");
        }

        if (typesResponse.status_code === 200 && typesResponse.data) {
          setResourceTypes(typesResponse.data);
        }
      } catch {
        setError("Failed to fetch resource");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isDirty = () => {
    if (!formData || !originalData) return false;
    return (
      formData.title !== originalData.title ||
      formData.type !== originalData.type ||
      (formData.url || "") !== (originalData.url || "") ||
      formData.description !== originalData.description ||
      (formData.use_case || "") !== (originalData.use_case || "")
    );
  };

  const handleUpdate = async () => {
    if (!formData || !id) return;

    setUpdating(true);
    setToast(null);

    try {
      const response = await resources.update(id, {
        title: formData.title,
        type: formData.type,
        url: formData.url,
        description: formData.description,
        use_case: formData.use_case,
      });

      if (response.status_code === 200) {
        const updatedData = response.data as Resource;
        setFormData(updatedData);
        setOriginalData(updatedData);
        setToast({ message: "Resource updated successfully", type: "success" });
      } else {
        setToast({ message: response.message || "Failed to update resource", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to update resource", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setDeleting(true);
    try {
      const response = await resources.delete(id);
      if (response.status_code === 200) {
        navigate("/dashboard");
      } else {
        setToast({ message: response.message || "Failed to delete resource", type: "error" });
        setShowDeleteModal(false);
      }
    } catch {
      setToast({ message: "Failed to delete resource", type: "error" });
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Resource</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Back
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : error || !formData ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">{error || "Resource not found"}</div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {resourceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label htmlFor="use_case" className="block text-sm font-medium text-gray-300 mb-2">
                  Use Case
                </label>
                <textarea
                  id="use_case"
                  name="use_case"
                  value={formData.use_case || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Describe when and how to use this resource..."
                />
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 space-y-1">
                  <p>
                    Created:{" "}
                    {new Date(formData.created_at).toLocaleString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-500 transition-colors cursor-pointer"
                >
                  Delete Resource
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={!isDirty() || updating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "Updating..." : "Update Resource"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && formData && (
        <ConfirmModal
          title="Delete Resource"
          message={`Are you sure you want to delete "${formData.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={deleting}
        />
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </Layout>
  );
}
