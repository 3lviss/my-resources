import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resources } from "../../lib/api";
import Layout from "../../layouts/Layout";
import Button from "../../components/Button";
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
        navigate("/resources");
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
          <Button variant="ghost" onClick={() => navigate("/resources")}>
            Back
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : error || !formData ? (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">{error || "Resource not found"}</div>
            <Button variant="ghost" onClick={() => navigate("/resources")}>
              Back to Resources
            </Button>
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="url" className="block text-sm font-medium text-gray-300">
                    URL
                  </label>
                  {formData.url && (
                    <a
                      href={formData.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-gray-400 hover:text-purple-400 transition-colors"
                      title="Visit URL"
                    >
                      <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="none" stroke="currentColor" strokeWidth="32" className="w-5 h-5">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <title>open-external</title>
                          <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="icon" fill="currentColor" transform="translate(85.333333, 64.000000)">
                              <path d="M128,63.999444 L128,106.666444 L42.6666667,106.666667 L42.6666667,320 L256,320 L256,234.666444 L298.666,234.666444 L298.666667,362.666667 L4.26325641e-14,362.666667 L4.26325641e-14,64 L128,63.999444 Z M362.666667,1.42108547e-14 L362.666667,170.666667 L320,170.666667 L320,72.835 L143.084945,249.751611 L112.915055,219.581722 L289.83,42.666 L192,42.6666667 L192,1.42108547e-14 L362.666667,1.42108547e-14 Z" id="Combined-Shape"> </path>
                            </g>
                          </g>
                        </g>
                      </svg>
                    </a>
                  )}
                </div>
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
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                  Delete Resource
                </Button>
                <Button onClick={handleUpdate} disabled={!isDirty() || updating}>
                  {updating ? "Updating..." : "Update Resource"}
                </Button>
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
