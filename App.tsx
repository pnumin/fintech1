import React, { useState, useCallback } from 'react';
import { SearchInput } from './components/SearchInput';
import { DefinitionDisplay } from './components/DefinitionDisplay';
import { getFinancialTermDefinition, summarizeDefinition } from './services/geminiService';

const App: React.FC = () => {
  const [term, setTerm] = useState<string>('');
  const [definition, setDefinition] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setError('검색할 단어를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDefinition('');
    setSummary('');
    setIsExpanded(false);
    setTerm(searchTerm);

    try {
      const fullDefinition = await getFinancialTermDefinition(searchTerm);
      const summarizedText = await summarizeDefinition(fullDefinition);
      
      setDefinition(fullDefinition);
      setSummary(summarizedText);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            AI 금융 사전
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            궁금한 최신 금융 용어를 검색하고 AI의 명쾌한 설명을 확인하세요.
          </p>
        </header>

        <main>
          <div className="sticky top-4 z-10 bg-gray-900/80 backdrop-blur-sm py-4">
            <SearchInput onSearch={handleSearch} isLoading={isLoading} />
          </div>
          
          <div className="mt-8">
            <DefinitionDisplay
              term={term}
              summary={summary}
              definition={definition}
              isLoading={isLoading}
              error={error}
              isExpanded={isExpanded}
              onToggleExpand={handleToggleExpand}
            />
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
