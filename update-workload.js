import fs from 'fs';

const aulasStr = fs.readFileSync('src/data/aulas.js', 'utf8');
const workloadStr = fs.readFileSync('C:/Users/auke3/.gemini/antigravity-ide/brain/dabe3e70-93fc-49dc-b81a-acb485730ecb/scratch/workload.txt', 'utf8');

// Parse workloads
const workloads = {};
const lines = workloadStr.split('\n');
for (const line of lines) {
  const match = line.match(/\t(.*) \((\d+)h\)/);
  if (match) {
    let title = match[1].trim();
    const hours = parseInt(match[2], 10);
    // Normalize string for better matching
    title = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
    workloads[title] = hours;
  }
}

// Function to normalize title
function normalize(str) {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
}

// Update aulas.js
// We'll use a regex to find each object and add the workload
let updatedAulasStr = aulasStr;
const regex = /title: '(.*?)',/g;

updatedAulasStr = updatedAulasStr.replace(regex, (match, title) => {
  let cleanTitle = title.replace(/^\d+-/, '').trim();
  let normTitle = normalize(cleanTitle);
  
  let hours = workloads[normTitle];
  
  // Manual fallbacks for fuzzy matches
  if (!hours) {
    if (normTitle.includes('aulamagna')) hours = 1;
    if (normTitle.includes('instrucoesgerais')) hours = 1;
    if (normTitle.includes('computacaodealtodesempenho')) hours = 6;
    if (normTitle.includes('tecnologiadainformacao')) hours = 6;
    if (normTitle.includes('deeplearning')) hours = 18;
    if (normTitle.includes('python')) {
      if (normTitle.includes('analise')) hours = 40;
      else hours = 40;
    }
  }

  // If still not found, we can default to 6 or 0 and manually check
  if (!hours) {
    console.log('NOT FOUND:', title, '->', normTitle);
    hours = 6; // default 
  }
  
  return `title: '${title}',\n    workload: ${hours},`;
});

fs.writeFileSync('src/data/aulas.js', updatedAulasStr, 'utf8');
console.log('aulas.js updated with workloads!');
