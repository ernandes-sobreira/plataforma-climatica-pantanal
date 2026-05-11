import { useState } from 'react';
import { Link2, ExternalLink } from 'lucide-react';
import { useCollection } from '../hooks/useFirestore';
import type { UsefulLink } from '../../../shared/schema';
import seedData from '../data/seed.json';

export default function Links() {
  const [search, setSearch] = useState('');
  const { data: fbLinks, isLoading } = useCollection<UsefulLink>('usefulLinks');
  const links = fbLinks.length > 0 ? fbLinks : (seedData.usefulLinks as UsefulLink[]);
  const categories = ['Todos', ...Array.from(new Set(links.map(l => l.category)))];
  const [cat, setCat] = useState('Todos');

  const filtered = links.filter(l =>
    (cat === 'Todos' || l.category === cat) &&
    (!search || l.title.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link2 className="w-8 h-8 text-cyan-600" />
        <h1 className="text-2xl font-bold text-gray-800">Links Úteis</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" placeholder="Buscar links..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none" />
        <select value={cat} onChange={e => setCat(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-cyan-500 outline-none">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {isLoading ? <div className="text-center py-8 text-gray-500">Carregando...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((link, i) => (
            <a key={link.id || i} href={link.url} target="_blank" rel="noreferrer"
              className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 group-hover:text-cyan-600 transition-colors text-sm">{link.title}</h3>
                <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
              </div>
              <p className="text-xs text-gray-500 mb-2">{link.description}</p>
              <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">{link.category}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
