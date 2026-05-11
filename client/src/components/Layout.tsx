import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, BookOpen, Leaf, BarChart3, Heart, Trees,
  BookMarked, Link2, Film, ClipboardList, HelpCircle, Settings, Menu, X
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/glossario', label: 'Glossário', icon: BookOpen },
  { path: '/pegada-carbono', label: 'Pegada de Carbono', icon: Leaf },
  { path: '/simulacao-co2', label: 'Simulação CO₂', icon: BarChart3 },
  { path: '/saude-clima', label: 'Saúde & Clima', icon: Heart },
  { path: '/biodiversidade', label: 'Biodiversidade', icon: Trees },
  { path: '/referencias', label: 'Referências', icon: BookMarked },
  { path: '/links', label: 'Links Úteis', icon: Link2 },
  { path: '/midia', label: 'Mídia', icon: Film },
  { path: '/atividades', label: 'Atividades', icon: ClipboardList },
  { path: '/quiz-taiama', label: 'Quiz Taiamã', icon: HelpCircle },
  { path: '/admin', label: 'Admin', icon: Settings },
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-green-800 text-white z-30 transform transition-transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-300" />
            <div>
              <h1 className="font-bold text-sm leading-tight">Plataforma Climática</h1>
              <p className="text-green-300 text-xs">Pantanal | UNEMAT</p>
            </div>
          </div>
        </div>
        <nav className="p-2 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} href={path}>
              <a
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                  ${location === path
                    ? 'bg-green-600 text-white font-semibold'
                    : 'text-green-100 hover:bg-green-700'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </a>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-green-800 text-white px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-sm">Plataforma Climática — Pantanal</span>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
