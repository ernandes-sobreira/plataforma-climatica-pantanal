import { useState } from 'react';
import { BookMarked, Plus, Download, Printer } from 'lucide-react';
import { useCollection, addDocument } from '../hooks/useFirestore';
import { generateABNTCitation, exportToBib } from '../lib/utils-clima';
import type { Reference } from '../../../shared/schema';

export default function Referencias() {
  const { data: refs, isLoading } = useCollection<Reference>('references');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Reference>>({ type: 'article', year: new Date().getFullYear() });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.authors) return;
    const citation = generateABNTCitation(form as Reference);
    await addDocument('references', { ...form, abntCitation: citation });
    setShowForm(false);
    setForm({ type: 'article', year: new Date().getFullYear() });
  };

  const handleExportBib = () => {
    const bib = exportToBib(refs);
    const blob = new Blob([bib], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'referencias.bib'; a.click();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookMarked className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Referências Bibliográficas</h1>
        </div>
        <div className="flex gap-2 no-print">
          <button onClick={() => window.print()} className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            <Printer className="w-4 h-4" /> Imprimir
          </button>
          {refs.length > 0 && (
            <button onClick={handleExportBib} className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <Download className="w-4 h-4" /> Exportar .bib
            </button>
          )}
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Nova Referência</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">Título*</label>
              <input value={form.title || ''} onChange={e => setForm(p => ({...p, title: e.target.value}))} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">Autores*</label>
              <input value={form.authors || ''} onChange={e => setForm(p => ({...p, authors: e.target.value}))} required placeholder="SOBRENOME, Nome"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Ano*</label>
              <input type="number" value={form.year || ''} onChange={e => setForm(p => ({...p, year: +e.target.value}))} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Tipo</label>
              <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value as Reference['type']}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                <option value="article">Artigo</option>
                <option value="book">Livro</option>
                <option value="report">Relatório</option>
                <option value="thesis">Tese/Dissertação</option>
                <option value="website">Website</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Periódico/Editora</label>
              <input value={form.journal || ''} onChange={e => setForm(p => ({...p, journal: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">DOI</label>
              <input value={form.doi || ''} onChange={e => setForm(p => ({...p, doi: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      ) : refs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <BookMarked className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>Nenhuma referência cadastrada. Adicione a primeira!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {refs.map((ref, i) => (
            <div key={ref.id || i} className="bg-white border border-gray-200 rounded-lg p-4 print-section">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{ref.type}</span>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: ref.abntCitation || generateABNTCitation(ref) }} />
              {ref.doi && (
                <a href={`https://doi.org/${ref.doi}`} target="_blank" rel="noreferrer"
                  className="text-xs text-indigo-600 hover:underline mt-1 block">
                  DOI: {ref.doi}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
