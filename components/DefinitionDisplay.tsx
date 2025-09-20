import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface DefinitionDisplayProps {
  term: string;
  summary: string;
  definition: string;
  isLoading: boolean;
  error: string | null;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const WelcomeMessage: React.FC = () => (
    <div className="text-center p-8 border-2 border-dashed border-gray-700 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-300">무엇이 궁금하신가요?</h3>
        <p className="mt-2 text-gray-500">
            위 검색창에 금융 용어를 입력하여 AI의 설명을 들어보세요.
        </p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center p-8 bg-red-900/30 border border-red-700 rounded-lg">
        <h3 className="text-xl font-semibold text-red-300">오류가 발생했습니다</h3>
        <p className="mt-2 text-red-400">{message}</p>
    </div>
);

const FormattedDefinition: React.FC<{ text: string }> = ({ text }) => {
    // Basic markdown-like formatting for newlines and bolding
    const formattedText = text
      .split('**')
      .map((part, index) => 
        index % 2 !== 0 ? <strong key={index} className="text-blue-300 font-semibold">{part}</strong> : part
      )
      .flatMap(part => 
        typeof part === 'string' 
        ? part.split('\n').map((line, i) => <React.Fragment key={i}>{line}{i !== part.split('\n').length - 1 && <br />}</React.Fragment>)
        : [part]
      );

    return <p className="text-gray-300 leading-relaxed whitespace-pre-line">{formattedText}</p>;
};


export const DefinitionDisplay: React.FC<DefinitionDisplayProps> = ({ term, summary, definition, isLoading, error, isExpanded, onToggleExpand }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <LoadingSpinner />
        <p className="mt-4 text-gray-400 animate-pulse">AI가 용어를 분석하고 있습니다...</p>
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!definition) {
    return <WelcomeMessage />;
  }

  return (
    <div className="bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-300 mb-4">{term}</h2>
      <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
        <FormattedDefinition text={isExpanded ? definition : (summary || definition)} />
      </div>
      {summary && (
        <div className="text-right mt-6">
          <button
            onClick={onToggleExpand}
            className="px-4 py-2 font-semibold text-blue-300 hover:text-blue-200 hover:bg-blue-900/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
            aria-expanded={isExpanded}
          >
            {isExpanded ? '간략히 보기' : '자세히 보기'}
          </button>
        </div>
      )}
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
