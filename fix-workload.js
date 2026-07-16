import fs from 'fs';

let content = fs.readFileSync('src/data/aulas.js', 'utf8');

const replacements = [
  { match: /title: '29-Inteligência Artificial Generativa',\s+workload: 6,/g, replacement: "title: '29-Inteligência Artificial Generativa',\n    workload: 30," },
  { match: /title: '32-Big Data e Hadoop',\s+workload: 6,/g, replacement: "title: '32-Big Data e Hadoop',\n    workload: 6," }, // already 6, but just to be sure
  { match: /title: '33-Processamento de Big Data com Spark',\s+workload: 6,/g, replacement: "title: '33-Processamento de Big Data com Spark',\n    workload: 20," },
  { match: /title: '37-Processamento de Big Data com DASK',\s+workload: 6,/g, replacement: "title: '37-Processamento de Big Data com DASK',\n    workload: 20," },
  { match: /title: '38-Bancos de Dados Não Relacionais - NoSQL',\s+workload: 6,/g, replacement: "title: '38-Bancos de Dados Não Relacionais - NoSQL',\n    workload: 12," },
  { match: /title: '49-Escrita de Artigos e Metodologia Científica',\s+workload: 6,/g, replacement: "title: '49-Escrita de Artigos e Metodologia Científica',\n    workload: 48," },
  { match: /title: '52-O que é inovação\? Tipos de Inovação',\s+workload: 6,/g, replacement: "title: '52-O que é inovação? Tipos de Inovação',\n    workload: 10," },
  { match: /title: '53-Qualidades da mente inovadora',\s+workload: 6,/g, replacement: "title: '53-Qualidades da mente inovadora',\n    workload: 20," },
  { match: /title: '70-Systematic Inventive Thinking \(SIT\)',\s+workload: 6,/g, replacement: "title: '70-Systematic Inventive Thinking (SIT)',\n    workload: 20," },
  { match: /title: '77-Shared Workspace for Applied Projects \(SWAP\)',\s+workload: 6,/g, replacement: "title: '77-Shared Workspace for Applied Projects (SWAP)',\n    workload: 10," },
  { match: /title: '80-Matriz SWOT e TOWS',\s+workload: 6,/g, replacement: "title: '80-Matriz SWOT e TOWS',\n    workload: 20," },
  { match: /title: '81-Minimum Viable Product \(MVP\) e Protótipos',\s+workload: 6,/g, replacement: "title: '81-Minimum Viable Product (MVP) e Protótipos',\n    workload: 10," }
];

replacements.forEach(r => {
  content = content.replace(r.match, r.replacement);
});

fs.writeFileSync('src/data/aulas.js', content, 'utf8');
console.log('Fixed missing workloads!');
