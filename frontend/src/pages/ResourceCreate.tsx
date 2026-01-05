import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resources } from "../lib/api";
import Layout from "../components/Layout";
import Toast from "../components/Toast";

interface FormData {
  title: string;
  type: string;
  url: string;
  description: string;
  use_case: string;
}

export default function ResourceCreate() {
  const navigate = useNavigate();
  const [resourceTypes, setResourceTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    type: "",
    url: "",
    description: "",
    use_case: "",
  });

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await resources.getTypes();
        if (response.status_code === 200 && response.data) {
          setResourceTypes(response.data);
          setFormData((prev) => ({ ...prev, type: response.data![0] || "" }));
        }
      } catch {
        setToast({ message: "Failed to load resource types", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);

    try {
      const response = await resources.create({
        title: formData.title,
        type: formData.type,
        url: formData.url || null,
        description: formData.description,
        use_case: formData.use_case || null,
      });

      if (response.status_code === 201) {
        setToast({ message: "Resource created successfully", type: "success" });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setToast({ message: response.message || "Failed to create resource", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to create resource", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">New Resource</h1>
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
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6">
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
                  required
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
                  required
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
                  URL <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
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
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label htmlFor="use_case" className="block text-sm font-medium text-gray-300 mb-2">
                  Use Case <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                  id="use_case"
                  name="use_case"
                  value={formData.use_case}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Describe when and how to use this resource..."
                />
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating..." : "Create Resource"}
                </button>
              </div>
            </div>
          </form>
        )}
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
    </Layout>
  );
}
