const fs = require('fs');

const csvData = fs.readFileSync('data/Aulas_oficial.csv', 'utf-8');
const jsData = fs.readFileSync('src/data/aulas.js', 'utf-8');

const prefix = 'https://teams.microsoft.com/l/entity/com.microsoft.teamspace.tab.files.sharepoint/files?webUrl=';

const csvLines = csvData.split('\n').filter(line => line.trim() !== '' && !line.startsWith('"Título"'));

const urlMap = {};

csvLines.forEach(line => {
  // Regex to parse "title","date","url"
  const regex = /"([^"]+)","([^"]+)","([^"]+)"/;
  const match = line.match(regex);
  if (match) {
    let title = match[1].replace(/^\s*\d+-/, '').trim(); // Remove leading numbers like "03-"
    let url = match[3].trim();
    if (url && url !== '') {
      // Normalize URL (add prefix if not already present)
      if (!url.startsWith('http')) {
        url = prefix + url;
      }
      urlMap[title.toLowerCase()] = url;
    }
  }
});

let updatedJs = jsData;

// Iterate through the JS file and replace materialUrl: '' with the matched URL
// Format in JS: title: '...', \n    workload: ..., date: ..., materialUrl: ''
const jsLines = updatedJs.split('\n');

for (let i = 0; i < jsLines.length; i++) {
  if (jsLines[i].includes('title: \'')) {
    const titleMatch = jsLines[i].match(/title: '([^']+)'/);
    if (titleMatch) {
      const jsTitle = titleMatch[1];
      // Try to find the closest match in the map
      let matchedUrl = null;
      for (const [csvTitle, url] of Object.entries(urlMap)) {
        // Clean both strings to compare
        const cleanJs = jsTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanCsv = csvTitle.replace(/[^a-z0-9]/g, '');
        if (cleanCsv.includes(cleanJs) || cleanJs.includes(cleanCsv)) {
          matchedUrl = url;
          break;
        }
      }

      if (matchedUrl) {
        // The materialUrl is usually on the next line or same line
        if (jsLines[i].includes('materialUrl: \'\'')) {
          jsLines[i] = jsLines[i].replace(/materialUrl: ''/, `materialUrl: '${matchedUrl}'`);
        } else if (i + 1 < jsLines.length && jsLines[i+1].includes('materialUrl: \'\'')) {
          jsLines[i+1] = jsLines[i+1].replace(/materialUrl: ''/, `materialUrl: '${matchedUrl}'`);
        }
      }
    }
  }
}

fs.writeFileSync('src/data/aulas.js', jsLines.join('\n'));
console.log('URLs injected successfully');
