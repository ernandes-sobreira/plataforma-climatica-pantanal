import { BarChart3, Leaf, BookOpen, Trees, Heart, HelpCircle } from 'lucide-react';
import { Link } from 'wouter';

const cards = [
  { title: 'Pegada de Carbono', desc: 'Calcule suas emissões de CO₂ por atividades diárias', icon: Leaf, path: '/pegada-carbono', color: 'bg-green-100 text-green-700' },
  { title: 'Simulação CO₂', desc: 'Visualize projeções de concentração de CO₂ atmosférico', icon: BarChart3, path: '/simulacao-co2', color: 'bg-blue-100 text-blue-700' },
  { title: 'Glossário', desc: 'Termos e conceitos de mudanças climáticas', icon: BookOpen, path: '/glossario', color: 'bg-purple-100 text-purple-700' },
  { title: 'Biodiversidade', desc: 'Impactos climáticos na fauna e flora do Pantanal', icon: Trees, path: '/biodiversidade', color: 'bg-amber-100 text-amber-700' },
  { title: 'Saúde & Clima', desc: 'Relação entre mudanças climáticas e saúde humana', icon: Heart, path: '/saude-clima', color: 'bg-red-100 text-red-700' },
  { title: 'Quiz Taiamã', desc: 'Teste seus conhecimentos sobre o Pantanal', icon: HelpCircle, path: '/quiz-taiama', color: 'bg-indigo-100 text-indigo-700' },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 p-6 bg-gradient-to-r from-green-700 to-green-500 rounded-xl text-white">
        <h1 className="text-3xl font-bold mb-2">🌿 Plataforma Climática — Pantanal</h1>
        <p className="text-green-100 text-lg">
          Plataforma educacional interativa sobre mudanças climáticas no Pantanal,
          desenvolvida para pesquisadores e estudantes da UNEMAT.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map(({ title, desc, icon: Icon, path, color }) => (
          <Link key={path} href={path}>
            <a className="block p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
              <div className={`inline-flex p-3 rounded-lg mb-3 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </a>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1">🌡️ Clima do Pantanal</h4>
          <p className="text-sm text-blue-700">O Pantanal é o maior bioma de zona úmida continental do mundo, altamente vulnerável às mudanças climáticas.</p>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h4 className="font-semibold text-amber-800 mb-1">📊 Dados Científicos</h4>
          <p className="text-sm text-amber-700">Baseado em dados do IPCC, INPE e publicações científicas recentes sobre o Pantanal.</p>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-1">🎓 Para Pesquisadores</h4>
          <p className="text-sm text-green-700">Ferramentas e recursos para estudantes de pós-graduação do PPGCA/UNEMAT.</p>
        </div>
      </div>
    </div>
  );
}
