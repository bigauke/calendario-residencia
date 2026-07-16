
const { aulas } = require('./src/data/aulas.js');
const { getHoliday } = require('./src/utils.js');

function isBusinessDay(date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;
  if (getHoliday(date)) return false;
  return true;
}

function computeSchedule() {
  let currentDate = new Date('2026-03-27T12:00:00Z'); // Start date of first class
  
  for (let aula of aulas) {
    let daysNeeded = Math.ceil(aula.workload / 6);
    let classDays = [];
    
    while (daysNeeded > 0) {
      if (isBusinessDay(currentDate)) {
        classDays.push(new Date(currentDate));
        daysNeeded--;
      }
      if (daysNeeded > 0) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    // Check if this class is in July
    if (classDays.some(d => d.getMonth() === 6)) {
      console.log(aula.title, 'starts on', classDays[0].toDateString(), 'ends on', classDays[classDays.length-1].toDateString());
    }
    
    // Move to next day for the next class
    currentDate.setDate(currentDate.getDate() + 1);
    while (!isBusinessDay(currentDate)) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
}

computeSchedule();

