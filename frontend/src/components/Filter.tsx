interface FilterOption {
  label: string;
  value: string;
}

interface FilterProps {
  value: string | undefined;
  options: FilterOption[];
  onChange: (value: string | undefined) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function Filter({
  value,
  options,
  onChange,
  isLoading = false,
  placeholder = "Select...",
}: FilterProps) {
  return (
    <div className="flex items-center gap-2 w-full lg:flex-1 lg:min-w-[200px] h-10 relative bg-gray-700 border border-gray-600 rounded hover:border-gray-500 focus-within:border-purple-500 transition-colors">
      <select
        id="filter-select"
        value={value || ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={isLoading}
        className="w-full h-full px-3 bg-transparent text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-sm appearance-none"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {value && (
        <button
          onClick={() => onChange(undefined)}
          disabled={isLoading}
          className="absolute right-2 h-full text-gray-400 hover:text-gray-300 flex items-center justify-center flex-shrink-0"
          title="Clear filter"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {!value && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="absolute right-3 w-4 h-4 text-gray-400 pointer-events-none flex-shrink-0"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      )}
    </div>
  );
}
