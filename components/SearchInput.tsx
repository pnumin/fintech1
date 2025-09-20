import React, { useState } from 'react';

interface SearchInputProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
}

const SearchIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [localTerm, setLocalTerm] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(localTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={localTerm}
        onChange={(e) => setLocalTerm(e.target.value)}
        placeholder="예: 스톡옵션, ESG, 핀테크..."
        className="flex-grow w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:opacity-50"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 px-5 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        <SearchIcon />
        <span>{isLoading ? '검색중...' : '검색'}</span>
      </button>
    </form>
  );
};
