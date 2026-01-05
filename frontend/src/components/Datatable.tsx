interface Resource {
  id: string;
  title: string;
  type: string;
  url: string | null;
  description: string;
  use_case: string | null;
  created_at: string;
}

interface ResourcesTableProps {
  resources: Resource[];
  loading: boolean;
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
}

export default function ResourcesTable({
  resources,
  loading,
  onEdit,
  onDelete,
}: ResourcesTableProps) {
  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading...</div>;
  }

  if (resources.length === 0) {
    return <div className="p-8 text-center text-gray-400">No resources found</div>;
  }

  return (
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
          {resources.map((resource) => (
            <tr key={resource.id} className="hover:bg-gray-750">
              <td className="px-4 py-3 text-white font-medium">{resource.title}</td>
              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs rounded bg-purple-600 text-white capitalize">
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
                    className="text-purple-400 hover:text-purple-300 cursor-pointer"
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
                    onClick={() => onEdit(resource)}
                    className="p-2 text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(resource)}
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
  );
}
