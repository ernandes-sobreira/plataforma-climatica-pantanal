import { Film } from 'lucide-react';
import { useCollection } from '../hooks/useFirestore';
import type { MediaContent } from '../../../shared/schema';

export default function Midia() {
  const { data: media, isLoading } = useCollection<MediaContent>('mediaContent');

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Film className="w-8 h-8 text-pink-600" />
        <h1 className="text-2xl font-bold text-gray-800">Mídia — Pantanal & Clima</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      ) : media.length === 0 ? (
        <div className="text-center py-12">
          <Film className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum conteúdo de mídia cadastrado</h3>
          <p className="text-gray-400 text-sm">Adicione vídeos, imagens e documentos pelo painel de administração.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {media.map((item, i) => (
            <div key={item.id || i} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              {item.thumbnailUrl ? (
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                  <Film className="w-10 h-10 text-gray-300" />
                </div>
              )}
              <div className="p-4">
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">{item.type}</span>
                <h3 className="font-semibold text-gray-800 mt-2 mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.description}</p>
                <a href={item.url} target="_blank" rel="noreferrer"
                  className="mt-3 block text-center bg-pink-500 hover:bg-pink-600 text-white text-sm py-2 rounded-lg transition-colors">
                  Acessar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
