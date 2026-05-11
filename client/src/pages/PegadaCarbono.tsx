import { useState } from 'react';
import { Leaf, Calculator, Printer } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateCarbonFootprint, type CarbonResult } from '../lib/utils-clima';
import { addDocument } from '../hooks/useFirestore';
import { getCurrentUserId } from '../lib/firebase';

const COLORS = ['#16a34a', '#2563eb', '#d97706', '#dc2626'];

export default function PegadaCarbono() {
  const [form, setForm] = useState({ kmCar: 0, kmBus: 0, kwhMonth: 0, beefKgWeek: 0, wasteKgWeek: 0 });
  const [result, setResult] = useState<CarbonResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: parseFloat(e.target.value) || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const calc = calculateCarbonFootprint(form);
    setResult(calc);
    try {
      await addDocument('carbonCalculations', {
        userId: getCurrentUserId(),
        date: new Date().toISOString(),
        ...calc,
      });
    } catch {}
  };

  const pieData = result ? [
    { name: 'Transporte', value: result.breakdown.transport },
    { name: 'Energia', value: result.breakdown.energy },
    { name: 'Alimentação', value: result.breakdown.food },
    { name: 'Resíduos', value: result.breakdown.waste },
  ].filter(d => d.value > 0) : [];

  const categoryColors: Record<string, string> = {
    'baixo': 'bg-green-100 text-green-800',
    'medio': 'bg-yellow-100 text-yellow-800',
    'alto': 'bg-orange-100 text-orange-800',
    'muito-alto': 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Leaf className="w-8 h-8 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-800">Calculadora de Pegada de Carbono</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" /> Insira seus dados
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-600 mb-2 text-sm uppercase tracking-wide">Transporte (por mês)</h3>
              <div className="space-y-2">
                <label className="block">
                  <span className="text-sm text-gray-600">Km de carro (gasolina)</span>
                  <input type="number" name="kmCar" value={form.kmCar} onChange={handleChange} min={0}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-600">Km de ônibus</span>
                  <input type="number" name="kmBus" value={form.kmBus} onChange={handleChange} min={0}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-600 mb-2 text-sm uppercase tracking-wide">Energia</h3>
              <label className="block">
                <span className="text-sm text-gray-600">Consumo de eletricidade (kWh/mês)</span>
                <input type="number" name="kwhMonth" value={form.kwhMonth} onChange={handleChange} min={0}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </label>
            </div>
            <div>
              <h3 className="font-medium text-gray-600 mb-2 text-sm uppercase tracking-wide">Alimentação (por semana)</h3>
              <label className="block">
                <span className="text-sm text-gray-600">Carne bovina consumida (kg)</span>
                <input type="number" name="beefKgWeek" value={form.beefKgWeek} onChange={handleChange} min={0} step={0.1}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </label>
            </div>
            <div>
              <h3 className="font-medium text-gray-600 mb-2 text-sm uppercase tracking-wide">Resíduos (por semana)</h3>
              <label className="block">
                <span className="text-sm text-gray-600">Resíduos orgânicos (kg)</span>
                <input type="number" name="wasteKgWeek" value={form.wasteKgWeek} onChange={handleChange} min={0} step={0.1}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
              </label>
            </div>
            <button type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors">
              Calcular Pegada de Carbono
            </button>
          </form>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-700">Resultado Anual</h2>
                <button onClick={() => window.print()} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 no-print">
                  <Printer className="w-4 h-4" /> Imprimir
                </button>
              </div>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold text-gray-800">{result.total.toLocaleString()}</p>
                <p className="text-gray-500">kg CO₂eq / ano</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${categoryColors[result.category]}`}>
                  Impacto {result.category.replace('-', ' ')}
                </span>
              </div>
              <div className="space-y-2">
                {Object.entries(result.breakdown).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">{key}</span>
                    <span className="font-medium">{val.toLocaleString()} kg</span>
                  </div>
                ))}
              </div>
            </div>

            {pieData.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-700 mb-4">Distribuição por Categoria</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {pieData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [v.toLocaleString() + ' kg', '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
