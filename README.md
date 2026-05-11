# Plataforma Interativa de Mudanças Climáticas — Pantanal

Plataforma educacional interativa sobre mudanças climáticas no Pantanal, desenvolvida para pesquisadores e estudantes de pós-graduação do PPGCA/UNEMAT.

## Funcionalidades

- **Dashboard** — Visão geral com acesso rápido aos módulos
- **Glossário** — Termos climáticos com busca e filtragem
- **Calculadora de Pegada de Carbono** — Emissões CO₂ com gráfico de pizza
- **Simulação CO₂** — Projeções por cenário RCP
- **Saúde & Clima** — Riscos de saúde por parâmetros climáticos
- **Biodiversidade** — Impactos na fauna e flora do Pantanal
- **Referências** — Gestão bibliográfica ABNT + exportação .bib
- **Links Úteis** — Curadoria de recursos
- **Mídia** — Vídeos, imagens e documentos
- **Atividades** — Módulos educacionais
- **Quiz Taiamã** — Questões sobre a Estação Ecológica Taiamã
- **Admin** — Configurações e gestão de dados

## Tecnologias

React 18 + TypeScript + Tailwind CSS + Recharts + Firebase + Vite 5

## Setup Rápido

```bash
git clone https://github.com/ernandes-sobreira/plataforma-climatica-pantanal.git
cd plataforma-climatica-pantanal
cp .env.example .env
# Preencha .env com suas configurações Firebase
npm install
npm run dev
```

## Deploy

```bash
npm run build && npm run deploy
```

## Firebase

1. Crie projeto em [console.firebase.google.com](https://console.firebase.google.com)
2. Ative Firestore e Authentication (Anônimo)
3. Preencha as variáveis em `.env`

> Sem Firebase configurado, o app funciona com dados locais do seed.json.

---
*PPGCA/UNEMAT — Plataforma Climática Pantanal*
