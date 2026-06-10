const fs = require('fs');

function loadSyllabusData() {
  const content = fs.readFileSync('d:/DAILY TRACKER/js/syllabus_data.js', 'utf8');
  const code = content + '\nmodule.exports = SyllabusData;';
  const tempFile = 'd:/DAILY TRACKER/temp_syllabus_eval.js';
  fs.writeFileSync(tempFile, code);
  const data = require('./temp_syllabus_eval.js');
  fs.unlinkSync(tempFile);
  return data;
}

const syllabus = loadSyllabusData();
for (const paper in syllabus) {
  console.log(`\n=== ${paper} ===`);
  syllabus[paper].topics.forEach(t => {
    console.log(`  ID: ${t.id} | Title: ${t.title.substring(0, 80)}`);
  });
}
