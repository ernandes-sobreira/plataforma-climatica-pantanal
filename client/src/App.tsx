import { Switch, Route } from 'wouter';
import { Suspense, lazy } from 'react';
import Layout from './components/Layout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Glossario = lazy(() => import('./pages/Glossario'));
const PegadaCarbono = lazy(() => import('./pages/PegadaCarbono'));
const SimulacaoCO2 = lazy(() => import('./pages/SimulacaoCO2'));
const SaudeClima = lazy(() => import('./pages/SaudeClima'));
const Biodiversidade = lazy(() => import('./pages/Biodiversidade'));
const Referencias = lazy(() => import('./pages/Referencias'));
const Links = lazy(() => import('./pages/Links'));
const Midia = lazy(() => import('./pages/Midia'));
const Atividades = lazy(() => import('./pages/Atividades'));
const QuizTaiama = lazy(() => import('./pages/QuizTaiama'));
const Admin = lazy(() => import('./pages/Admin'));

const Loading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
  </div>
);

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/glossario" component={Glossario} />
          <Route path="/pegada-carbono" component={PegadaCarbono} />
          <Route path="/simulacao-co2" component={SimulacaoCO2} />
          <Route path="/saude-clima" component={SaudeClima} />
          <Route path="/biodiversidade" component={Biodiversidade} />
          <Route path="/referencias" component={Referencias} />
          <Route path="/links" component={Links} />
          <Route path="/midia" component={Midia} />
          <Route path="/atividades" component={Atividades} />
          <Route path="/quiz-taiama" component={QuizTaiama} />
          <Route path="/admin" component={Admin} />
          <Route>
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600">Página não encontrada</p>
                <a href="/" className="mt-4 inline-block text-green-600 hover:underline">
                  Voltar ao início
                </a>
              </div>
            </div>
          </Route>
        </Switch>
      </Suspense>
    </Layout>
  );
}
