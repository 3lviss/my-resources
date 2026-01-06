import { type InputHTMLAttributes } from "react";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  icon?: boolean;
  onClear?: () => void;
}

export default function SearchInput({
  icon = true,
  className = "",
  value = "",
  onClear,
  ...props
}: SearchInputProps) {
  return (
    <div className="flex items-center gap-2 w-full lg:flex-1 lg:min-w-[200px] h-10 bg-gray-700 border border-gray-600 rounded hover:border-gray-500 focus-within:border-purple-500 transition-colors">
      {icon && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.5 5.5a7.5 7.5 0 0 0 10.5 10.5Z"
          />
        </svg>
      )}
      <input
        type="text"
        className={`w-full px-2 h-full bg-transparent text-white placeholder-gray-400 focus:outline-none ${className}`.trim()}
        value={value}
        {...props}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="px-2 h-full text-gray-400 hover:text-gray-300 flex items-center justify-center flex-shrink-0"
          title="Clear search"
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
    </div>
  );
}
