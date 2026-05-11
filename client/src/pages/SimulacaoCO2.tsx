import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function generateCO2Data(startYear: number, endYear: number, scenario: string) {
  const baselinePpm = 280;
  const currentPpm = 420;
  const data = [];
  for (let year = startYear; year <= endYear; year++) {
    let ppm = currentPpm;
    const yearsFromNow = year - 2024;
    if (yearsFromNow > 0) {
      const rate = scenario === 'optimista' ? 0.5 : scenario === 'moderado' ? 2.5 : 4.5;
      ppm = currentPpm + rate * yearsFromNow;
    } else if (year < 2024) {
      const progress = (year - 1750) / (2024 - 1750);
      ppm = baselinePpm + (currentPpm - baselinePpm) * progress * progress;
    }
    data.push({ year, ppm: Math.round(ppm), temp: parseFloat(((ppm - 280) / 130).toFixed(2)) });
  }
  return data;
}

export default function SimulacaoCO2() {
  const [scenario, setScenario] = useState('moderado');
  const [range, setRange] = useState([1900, 2100]);
  const data = generateCO2Data(range[0], range[1], scenario);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Simulação de CO₂ Atmosférico</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Cenário de Emissão</label>
            <select value={scenario} onChange={e => setScenario(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="optimista">Otimista (RCP 2.6)</option>
              <option value="moderado">Moderado (RCP 4.5)</option>
              <option value="pessimista">Pessimista (RCP 8.5)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Período Inicial</label>
            <input type="number" value={range[0]} min={1750} max={2020}
              onChange={e => setRange([Number(e.target.value), range[1]])}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-24" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">Período Final</label>
            <input type="number" value={range[1]} min={2025} max={2200}
              onChange={e => setRange([range[0], Number(e.target.value)])}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-24" />
          </div>
        </div>

        <h3 className="font-semibold text-gray-700 mb-3">Concentração de CO₂ (ppm)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ppm" stroke="#2563eb" dot={false} name="CO₂ (ppm)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800">Pré-Industrial (1750)</h4>
          <p className="text-2xl font-bold text-blue-600">280 ppm</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800">Atual (2024)</h4>
          <p className="text-2xl font-bold text-yellow-600">420 ppm</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-800">Limite Paris (2°C)</h4>
          <p className="text-2xl font-bold text-red-600">450 ppm</p>
        </div>
      </div>
    </div>
  );
}
