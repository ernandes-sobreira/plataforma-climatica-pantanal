import { useState } from 'react';
import { Heart } from 'lucide-react';
import { calculateHealthRisk } from '../lib/utils-clima';

export default function SaudeClima() {
  const [form, setForm] = useState({ temperature: 28, humidity: 70, floodRisk: 30 });
  const [result, setResult] = useState<ReturnType<typeof calculateHealthRisk> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(calculateHealthRisk(form));
  };

  const riskColors = { baixo: 'bg-green-100 text-green-800', medio: 'bg-yellow-100 text-yellow-800', alto: 'bg-red-100 text-red-800' };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-8 h-8 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-800">Saúde & Clima</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Parâmetros Climáticos</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-600">Temperatura média (°C): {form.temperature}°C</span>
              <input type="range" min={15} max={45} value={form.temperature}
                onChange={e => setForm(p => ({...p, temperature: +e.target.value}))}
                className="mt-2 w-full accent-red-500" />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Umidade relativa: {form.humidity}%</span>
              <input type="range" min={10} max={100} value={form.humidity}
                onChange={e => setForm(p => ({...p, humidity: +e.target.value}))}
                className="mt-2 w-full accent-red-500" />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Risco de enchentes: {form.floodRisk}%</span>
              <input type="range" min={0} max={100} value={form.floodRisk}
                onChange={e => setForm(p => ({...p, floodRisk: +e.target.value}))}
                className="mt-2 w-full accent-red-500" />
            </label>
            <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors">
              Avaliar Riscos de Saúde
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Resultado</h2>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-gray-800">{result.overallRisk}</p>
              <p className="text-gray-500">Índice de Risco (0–100)</p>
            </div>
            <div className="space-y-2 mb-4">
              {result.diseases.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{d.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${riskColors[d.risk]}`}>{d.risk}</span>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-2 text-sm">Recomendações</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {result.recommendations.map((r, i) => <li key={i}>• {r}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
