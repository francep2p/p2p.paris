const fs = require('fs'),
      csvtojson = require('csvtojson');

const csvFile = process.argv[2];
const destDir = process.argv[3];

if (!csvFile) {
  throw Error('CSV file not specified');
}

if (!destDir) {
  throw Error('Destination directory not specified');
}

csvtojson().fromFile(csvFile).then(rows => {
  
  const days = {};
  let lastDay = '';

  rows.forEach(row => {
    if (row.day) {
      lastDay = row.day;
      days[row.day] = [getTranslations(row)]
    } else {
      days[lastDay].push(getTranslations(row));
    }
  });

  const en = generateEvents('en', days);
  const fr = generateEvents('fr', days);

  fs.writeFileSync(`${destDir}/en.json`, JSON.stringify(en));
  fs.writeFileSync(`${destDir}/fr.json`, JSON.stringify(fr));
});

function generateEvents(lang, days) {
  let result = [];

  Object.keys(days).forEach((day, index) => {
    const events = days[day].map(e => e[lang]);
    const date = getEventDate(events);
    const d = {
      title: `${lang == 'fr' ? 'Jour' : 'Day'} ${index + 1}`,
      id: index + 1,
      date: date,
      events: events
    }
    result.push(d);
  });

  return result;
}

function getEventDate(events) {
  let date;
  events.forEach(event => {
    if (event.t_start != "TBA") {
      date = event.t_start;
    }
  })
  return date.substring(0, 10);
}

function getTranslations(row) {
  let translations = {
    en: {},
    fr: {}
  }

  Object.keys(row).forEach(key => {
    const value = row[key];
    if (isTranslated(key)) {
      const lang = key.substring(0, 2);
      translations[lang][key.replace(`${lang}_`, '')] = value;
    } else {
      translations.en[key] = value;
      translations.fr[key] = value;
    }
  })
  return translations;
}

function isTranslated(key) {
  return ['en_', 'fr_'].includes(key.substring(0, 3));
}