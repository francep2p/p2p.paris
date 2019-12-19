const fs = require('fs'),
      csvtojson = require('csvtojson')
      fetch = require('node-fetch');

const TMP_CSV = 'data.csv';
const SPREADSHEET_ID = '1z5GaDeDu2Ei_pCEFpFWSS53NZSmseBdDXuadUPh9qWE';
const SHEET_ID = 1547075518;
const DESTINATION_FOLDER = 'data/festival';

main();

async function main() {
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?gid=${SHEET_ID}&format=csv&id=${SPREADSHEET_ID}`;

  await downloadCsv(spreadsheetUrl);
  await generateJson(TMP_CSV);
  fs.unlinkSync(TMP_CSV);
}

function generateJson(csvFile) {
  return new Promise((resolve, reject) => {
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
    
      fs.writeFileSync(`${DESTINATION_FOLDER}/en.json`, JSON.stringify(en));
      fs.writeFileSync(`${DESTINATION_FOLDER}/fr.json`, JSON.stringify(fr));
      resolve();
    });
  })
  
}

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

async function downloadCsv(url) {
  const res = await fetch(url);
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(TMP_CSV);
    res.body.pipe(fileStream);
    res.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", function() {
      resolve();
    });
  });
}