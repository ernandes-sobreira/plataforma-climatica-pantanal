import { useState } from 'react';
import { Trees } from 'lucide-react';
import { calculateBiodiversityImpact } from '../lib/utils-clima';

export default function Biodiversidade() {
  const [params, setParams] = useState({ temperatureIncrease: 1.5, precipitationChange: -10, habitatLoss: 15 });
  const [result, setResult] = useState<ReturnType<typeof calculateBiodiversityImpact> | null>(null);

  const riskColors = { baixo: 'text-green-700 bg-green-100', moderado: 'text-yellow-700 bg-yellow-100', alto: 'text-orange-700 bg-orange-100', critico: 'text-red-700 bg-red-100' };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Trees className="w-8 h-8 text-amber-600" />
        <h1 className="text-2xl font-bold text-gray-800">Biodiversidade do Pantanal</h1>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-amber-800 text-sm">
          O Pantanal abriga mais de 4.700 espécies de plantas, 400 espécies de peixes, 650 de aves e 
          150 de mamíferos. As mudanças climáticas ameaçam esse extraordinário ecossistema.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Simular Impactos Climáticos</h2>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-600">Aumento de temperatura: +{params.temperatureIncrease}°C</span>
              <input type="range" min={0} max={5} step={0.1} value={params.temperatureIncrease}
                onChange={e => setParams(p => ({...p, temperatureIncrease: +e.target.value}))}
                className="mt-2 w-full accent-amber-600" />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Variação na precipitação: {params.precipitationChange}%</span>
              <input type="range" min={-50} max={50} value={params.precipitationChange}
                onChange={e => setParams(p => ({...p, precipitationChange: +e.target.value}))}
                className="mt-2 w-full accent-amber-600" />
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">Perda de habitat: {params.habitatLoss}%</span>
              <input type="range" min={0} max={100} value={params.habitatLoss}
                onChange={e => setParams(p => ({...p, habitatLoss: +e.target.value}))}
                className="mt-2 w-full accent-amber-600" />
            </label>
            <button onClick={() => setResult(calculateBiodiversityImpact(params))}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition-colors">
              Simular Impacto
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Resultado</h2>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-gray-800">{result.impactScore}/100</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${riskColors[result.riskLevel]}`}>
                Risco {result.riskLevel}
              </span>
            </div>
            {result.affectedSpecies.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2 text-sm">Espécies em risco:</h4>
                <ul className="space-y-1">
                  {result.affectedSpecies.map(s => (
                    <li key={s} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="text-amber-500">🦜</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="font-medium text-green-800 mb-2 text-sm">Recomendações</h4>
              <ul className="text-sm text-green-700 space-y-1">
                {result.recommendations.map((r, i) => <li key={i}>• {r}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
