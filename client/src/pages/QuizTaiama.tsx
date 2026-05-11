import { useState } from 'react';
import { HelpCircle, Plus } from 'lucide-react';
import { useCollection, addDocument } from '../hooks/useFirestore';
import { generateQuizSession, calculateQuizScore } from '../lib/utils-clima';
import type { QuizQuestion } from '../../../shared/schema';

export default function QuizTaiama() {
  const { data: questions, isLoading } = useCollection<QuizQuestion>('quizQuestions');
  const [session, setSession] = useState<ReturnType<typeof generateQuizSession> | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '', category: 'Taiamã', difficulty: 'medium' as const });

  const handleStart = () => {
    if (questions.length === 0) return;
    setSession(generateQuizSession(questions));
    setAnswers({});
    setSubmitted(false);
  };

  const handleSubmit = () => setSubmitted(true);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDocument('quizQuestions', form);
    setShowForm(false);
    setForm({ question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '', category: 'Taiamã', difficulty: 'medium' });
  };

  const score = submitted && session ? calculateQuizScore(answers, questions) : null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Quiz — Estação Ecológica Taiamã</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200">
          <Plus className="w-4 h-4" /> Adicionar questão
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddQuestion} className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-4">Nova Questão</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Enunciado*</label>
              <textarea value={form.question} onChange={e => setForm(p => ({...p, question: e.target.value}))} required rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            {form.options.map((opt, i) => (
              <div key={i}>
                <label className="text-sm text-gray-600 block mb-1">Opção {i + 1}{i === form.correctIndex ? ' ✓ (correta)' : ''}</label>
                <input value={opt} onChange={e => { const o = [...form.options]; o[i] = e.target.value; setForm(p => ({...p, options: o})); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            ))}
            <div>
              <label className="text-sm text-gray-600 block mb-1">Opção correta (índice 0–3)</label>
              <input type="number" min={0} max={3} value={form.correctIndex}
                onChange={e => setForm(p => ({...p, correctIndex: +e.target.value}))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-20" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Explicação</label>
              <textarea value={form.explanation} onChange={e => setForm(p => ({...p, explanation: e.target.value}))} rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Salvar</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">Cancelar</button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Carregando...</div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12">
          <HelpCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma questão cadastrada ainda</h3>
          <p className="text-gray-400 text-sm mb-4">Adicione questões sobre a Estação Ecológica Taiamã usando o botão acima.</p>
        </div>
      ) : !session ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">{questions.length} questão(ões) disponível(eis)</p>
          <button onClick={handleStart} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
            Iniciar Quiz
          </button>
        </div>
      ) : score ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-5xl font-bold text-indigo-600 mb-2">{score.percentage}%</p>
          <p className="text-gray-600 mb-4">{score.correct} de {score.total} questões corretas</p>
          <button onClick={() => { setSession(null); setSubmitted(false); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {session.questions.map((q, qi) => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-medium text-gray-800 mb-3">{qi + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <button key={oi} onClick={() => setAnswers(p => ({...p, [q.id]: oi}))}
                    className={`w-full text-left px-4 py-2 rounded-lg border text-sm transition-colors
                      ${answers[q.id] === oi ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={handleSubmit}
            disabled={Object.keys(answers).length < session.questions.length}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors">
            Enviar Respostas
          </button>
        </div>
      )}
    </div>
  );
}
