import { useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { useCollection } from '../hooks/useFirestore';
import type { GlossaryTerm } from '../../../shared/schema';
import seedData from '../data/seed.json';

export default function Glossario() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { data: firebaseTerms, isLoading } = useCollection<GlossaryTerm>('glossaryTerms');
  
  const terms = firebaseTerms.length > 0 ? firebaseTerms : (seedData.glossaryTerms as GlossaryTerm[]);
  
  const categories = ['Todos', ...Array.from(new Set(terms.map(t => t.category)))];
  
  const filtered = terms.filter(t => {
    const matchSearch = !search || 
      t.term.toLowerCase().includes(search.toLowerCase()) || 
      t.definition.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'Todos' || t.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-purple-600" />
        <h1 className="text-2xl font-bold text-gray-800">Glossário Climático</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar termos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum termo encontrado.</div>
          ) : filtered.map((term, i) => (
            <div key={term.id || i} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-800 text-lg">{term.term}</h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                  {term.category}
                </span>
              </div>
              <p className="text-gray-600 mt-2 text-sm leading-relaxed">{term.definition}</p>
              {term.source && (
                <p className="text-xs text-gray-400 mt-2">Fonte: {term.source}</p>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="text-sm text-gray-400 mt-4">{filtered.length} termo(s) encontrado(s)</p>
    </div>
  );
}
