// Utility functions for climate calculations

export interface CarbonBreakdown {
  transport: number;
  energy: number;
  food: number;
  waste: number;
}

export interface CarbonResult {
  total: number;
  breakdown: CarbonBreakdown;
  annualized: number;
  category: 'baixo' | 'medio' | 'alto' | 'muito-alto';
}

export function calculateCarbonFootprint(data: {
  kmCar?: number;
  kmBus?: number;
  kwhMonth?: number;
  beefKgWeek?: number;
  wasteKgWeek?: number;
}): CarbonResult {
  const {
    kmCar = 0, kmBus = 0, kwhMonth = 0,
    beefKgWeek = 0, wasteKgWeek = 0
  } = data;

  const transport = (kmCar * 0.21 + kmBus * 0.089) * 12;
  const energy = kwhMonth * 0.0757 * 12;
  const food = beefKgWeek * 27.0 * 52;
  const waste = wasteKgWeek * 0.56 * 52;
  const total = transport + energy + food + waste;

  let category: CarbonResult['category'] = 'baixo';
  if (total > 10000) category = 'muito-alto';
  else if (total > 5000) category = 'alto';
  else if (total > 2000) category = 'medio';

  return {
    total: Math.round(total),
    breakdown: {
      transport: Math.round(transport),
      energy: Math.round(energy),
      food: Math.round(food),
      waste: Math.round(waste),
    },
    annualized: Math.round(total),
    category,
  };
}

export function generateABNTCitation(ref: {
  authors: string;
  year: number;
  title: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  type: string;
}): string {
  const { authors, year, title, journal, volume, issue, pages, doi, url, type } = ref;
  
  const authorsFormatted = authors.toUpperCase();
  
  if (type === 'article' && journal) {
    let citation = `${authorsFormatted}. ${title}. <strong>${journal}</strong>`;
    if (volume) citation += `, v. ${volume}`;
    if (issue) citation += `, n. ${issue}`;
    if (pages) citation += `, p. ${pages}`;
    citation += `, ${year}.`;
    if (doi) citation += ` DOI: ${doi}.`;
    return citation;
  }
  
  if (type === 'book') {
    return `${authorsFormatted}. <strong>${title}</strong>. ${year}.`;
  }
  
  if (type === 'website' && url) {
    return `${authorsFormatted}. ${title}. Disponível em: <${url}>. Acesso em: ${new Date().toLocaleDateString('pt-BR')}.`;
  }
  
  return `${authorsFormatted}. ${title}. ${year}.`;
}

export function exportToBib(references: Array<{
  id?: string;
  authors: string;
  year: number;
  title: string;
  journal?: string;
  doi?: string;
  url?: string;
  type: string;
}>): string {
  return references.map((ref, i) => {
    const key = `ref${i + 1}_${ref.year}`;
    if (ref.type === 'article') {
      return `@article{${key},
  author = {${ref.authors}},
  title = {${ref.title}},
  journal = {${ref.journal || ''}},
  year = {${ref.year}},
  doi = {${ref.doi || ''}}
}`;
    }
    return `@misc{${key},
  author = {${ref.authors}},
  title = {${ref.title}},
  year = {${ref.year}},
  url = {${ref.url || ''}}
}`;
  }).join('

');
}

export interface BiodiversityResult {
  impactScore: number;
  riskLevel: 'baixo' | 'moderado' | 'alto' | 'critico';
  affectedSpecies: string[];
  recommendations: string[];
}

export function calculateBiodiversityImpact(params: {
  temperatureIncrease: number;
  precipitationChange: number;
  habitatLoss: number;
}): BiodiversityResult {
  const { temperatureIncrease, precipitationChange, habitatLoss } = params;
  
  const tempScore = temperatureIncrease * 15;
  const precipScore = Math.abs(precipitationChange) * 0.5;
  const habitatScore = habitatLoss * 2;
  const impactScore = Math.min(100, tempScore + precipScore + habitatScore);
  
  let riskLevel: BiodiversityResult['riskLevel'] = 'baixo';
  if (impactScore > 75) riskLevel = 'critico';
  else if (impactScore > 50) riskLevel = 'alto';
  else if (impactScore > 25) riskLevel = 'moderado';
  
  const affectedSpecies = [];
  if (temperatureIncrease > 1.5) affectedSpecies.push('Tuiuiú (Jabiru mycteria)');
  if (temperatureIncrease > 2) affectedSpecies.push('Onça-pintada (Panthera onca)');
  if (precipitationChange < -10) affectedSpecies.push('Capivara (Hydrochoerus hydrochaeris)');
  if (habitatLoss > 20) affectedSpecies.push('Arara-azul (Anodorhynchus hyacinthinus)');
  
  const recommendations = [
    'Monitorar populações de espécies indicadoras',
    'Implementar corredores ecológicos',
  ];
  if (impactScore > 50) recommendations.push('Estabelecer planos de conservação ex-situ');
  
  return { impactScore: Math.round(impactScore), riskLevel, affectedSpecies, recommendations };
}

export interface HealthRiskResult {
  overallRisk: number;
  diseases: Array<{ name: string; risk: 'baixo' | 'medio' | 'alto' }>;
  recommendations: string[];
}

export function calculateHealthRisk(params: {
  temperature: number;
  humidity: number;
  floodRisk: number;
}): HealthRiskResult {
  const { temperature, humidity, floodRisk } = params;
  
  const diseases = [
    { name: 'Dengue', risk: (temperature > 28 && humidity > 70 ? 'alto' : temperature > 25 ? 'medio' : 'baixo') as 'baixo' | 'medio' | 'alto' },
    { name: 'Leptospirose', risk: (floodRisk > 60 ? 'alto' : floodRisk > 30 ? 'medio' : 'baixo') as 'baixo' | 'medio' | 'alto' },
    { name: 'Malária', risk: (temperature > 27 && humidity > 80 ? 'alto' : temperature > 24 ? 'medio' : 'baixo') as 'baixo' | 'medio' | 'alto' },
    { name: 'Estresse Térmico', risk: (temperature > 35 ? 'alto' : temperature > 30 ? 'medio' : 'baixo') as 'baixo' | 'medio' | 'alto' },
  ];
  
  const riskValues = { baixo: 1, medio: 2, alto: 3 };
  const overallRisk = Math.round(
    diseases.reduce((sum, d) => sum + riskValues[d.risk], 0) / diseases.length * 33.3
  );
  
  const recommendations = ['Manter hidratação adequada', 'Usar repelentes contra mosquitos'];
  if (floodRisk > 50) recommendations.push('Evitar contato com água de enchentes');
  if (temperature > 35) recommendations.push('Evitar exposição solar no horário de pico');
  
  return { overallRisk, diseases, recommendations };
}

export interface QuizSession {
  questions: Array<{ id: string; question: string; options: string[] }>;
  totalQuestions: number;
  sessionId: string;
}

export function generateQuizSession(questions: Array<{
  id?: string;
  question: string;
  options: string[];
  correctIndex: number;
}>): QuizSession {
  const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 10);
  return {
    questions: shuffled.map((q, i) => ({
      id: q.id || String(i),
      question: q.question,
      options: q.options,
    })),
    totalQuestions: shuffled.length,
    sessionId: Date.now().toString(36),
  };
}

export function calculateQuizScore(
  answers: Record<string, number>,
  questions: Array<{ id?: string; correctIndex: number }>
): { score: number; percentage: number; correct: number; total: number } {
  const total = questions.length;
  const correct = questions.filter((q, i) => answers[q.id || String(i)] === q.correctIndex).length;
  return {
    score: correct * 10,
    percentage: Math.round((correct / total) * 100),
    correct,
    total,
  };
}
