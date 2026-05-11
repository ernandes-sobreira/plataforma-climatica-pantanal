import { ClipboardList } from 'lucide-react';
import { useCollection } from '../hooks/useFirestore';
import type { Activity } from '../../../shared/schema';

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export default function Atividades() {
  const { data: activities, isLoading } = useCollection<Activity>('activities');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <ClipboardList className="w-8 h-8 text-teal-600" />
        <h1 className="text-2xl font-bold text-gray-800">Atividades Educacionais</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12">
          <ClipboardList className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma atividade cadastrada</h3>
          <p className="text-gray-400 text-sm">Atividades educacionais serão adicionadas em breve.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activities.map((act, i) => (
            <div key={act.id || i} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{act.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[act.difficulty] || ''}`}>
                  {act.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{act.description}</p>
              <p className="text-xs text-gray-400">⏱ {act.estimatedTime} minutos</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
