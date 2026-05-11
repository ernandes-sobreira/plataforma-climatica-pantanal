import { useState, useEffect } from 'react';
import { Settings, Database, Palette, Monitor } from 'lucide-react';
import { useCollection, addDocument, deleteDocument } from '../hooks/useFirestore';
import type { EmissionFactor } from '../../../shared/schema';
import seedData from '../data/seed.json';

interface AppSettings {
  theme: 'light' | 'dark';
  displayMode: 'compact' | 'comfortable';
  language: 'pt-BR' | 'en';
}

const DEFAULT_SETTINGS: AppSettings = { theme: 'light', displayMode: 'comfortable', language: 'pt-BR' };

function loadSettings(): AppSettings {
  try {
    const saved = localStorage.getItem('app-settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function Admin() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const { data: factors, isLoading } = useCollection<EmissionFactor>('emissionFactors');
  const displayFactors = factors.length > 0 ? factors : (seedData.emissionFactors as EmissionFactor[]);
  const [newFactor, setNewFactor] = useState<Partial<EmissionFactor>>({ category: '', activity: '', factor: 0, unit: 'kgCO2', source: '' });
  const [showForm, setShowForm] = useState(false);

  const saveSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem('app-settings', JSON.stringify(updated));
  };

  const handleAddFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactor.category || !newFactor.activity) return;
    await addDocument('emissionFactors', newFactor as EmissionFactor);
    setShowForm(false);
    setNewFactor({ category: '', activity: '', factor: 0, unit: 'kgCO2', source: '' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-800">Administração</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-700">Configurações de Exibição</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-2">Tema</label>
              <div className="flex gap-2">
                {(['light', 'dark'] as const).map(t => (
                  <button key={t} onClick={() => saveSetting('theme', t)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${settings.theme === t ? 'border-green-500 bg-green-50 text-green-700 font-medium' : 'border-gray-300 hover:bg-gray-50'}`}>
                    {t === 'light' ? '☀️ Claro' : '🌙 Escuro'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">Modo de Exibição</label>
              <div className="flex gap-2">
                {(['compact', 'comfortable'] as const).map(m => (
                  <button key={m} onClick={() => saveSetting('displayMode', m)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${settings.displayMode === m ? 'border-green-500 bg-green-50 text-green-700 font-medium' : 'border-gray-300 hover:bg-gray-50'}`}>
                    {m === 'compact' ? '🗜️ Compacto' : '📐 Confortável'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Configurações salvas localmente no navegador.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-700">Status do Sistema</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Firebase</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${import.meta.env.VITE_FIREBASE_API_KEY ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {import.meta.env.VITE_FIREBASE_API_KEY ? 'Configurado' : 'Usando dados locais'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fatores de Emissão</span>
              <span className="text-gray-800 font-medium">{displayFactors.length} registros</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Versão</span>
              <span className="text-gray-800">1.0.0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-700">Fatores de Emissão</h2>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
            + Adicionar
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddFactor} className="bg-gray-50 rounded-lg p-4 mb-4 grid grid-cols-2 gap-3">
            <input placeholder="Categoria" value={newFactor.category} onChange={e => setNewFactor(p => ({...p, category: e.target.value}))} required
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <input placeholder="Atividade" value={newFactor.activity} onChange={e => setNewFactor(p => ({...p, activity: e.target.value}))} required
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <input type="number" step="0.001" placeholder="Fator" value={newFactor.factor} onChange={e => setNewFactor(p => ({...p, factor: +e.target.value}))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <input placeholder="Unidade" value={newFactor.unit} onChange={e => setNewFactor(p => ({...p, unit: e.target.value}))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <input placeholder="Fonte" value={newFactor.source} onChange={e => setNewFactor(p => ({...p, source: e.target.value}))}
              className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            <div className="col-span-2 flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">Salvar</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">Cancelar</button>
            </div>
          </form>
        )}

        {isLoading ? <div className="text-center py-4 text-gray-500 text-sm">Carregando...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="pb-2 font-medium">Categoria</th>
                  <th className="pb-2 font-medium">Atividade</th>
                  <th className="pb-2 font-medium">Fator</th>
                  <th className="pb-2 font-medium">Unidade</th>
                  <th className="pb-2 font-medium">Fonte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayFactors.map((f, i) => (
                  <tr key={f.id || i} className="text-gray-700">
                    <td className="py-2">{f.category}</td>
                    <td className="py-2">{f.activity}</td>
                    <td className="py-2 font-mono">{f.factor}</td>
                    <td className="py-2 text-gray-500">{f.unit}</td>
                    <td className="py-2 text-gray-400">{f.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
