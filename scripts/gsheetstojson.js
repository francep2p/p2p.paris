const fs = require('fs'),
      csvtojson = require('csvtojson')
      fetch = require('node-fetch');

const SPREADSHEET_ID = process.argv[2];
const SHEET_ID = process.argv[3];
const DEST_FILE_BASENAME = process.argv[4];
const TYPE = process.argv[5]; // Optional. Possible value: 'festival'

// Example: node gsheetstojson <SPREADHEET_ID> <SHEET_ID> <DESTINATION_FILE> <TYPE>

if (!SPREADSHEET_ID) {
  throw Error('Spreadsheet ID not specified');
}

if (!SHEET_ID) {
  throw Error('Sheet ID not specified');
}

if (!DEST_FILE_BASENAME) {
  throw Error('Destination file basename not specified');
}

main();

async function main() {
  const tmpCsvFilename = `${new Date().getTime()}.csv`;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?gid=${SHEET_ID}&format=csv&id=${SPREADSHEET_ID}`;

  await downloadCsv(spreadsheetUrl, tmpCsvFilename);
  await generateJson(tmpCsvFilename);
  fs.unlinkSync(tmpCsvFilename);
}

function generateJson(csvFile) {
  return new Promise((resolve, reject) => {
    csvtojson().fromFile(csvFile).then(rows => {

      let result = { en: [], fr: [] }

      if (TYPE == 'festival') {
        const days = {};
        let lastDay = '';
      
        rows.forEach(row => {
          const translatedRow = getTranslations(row);
          if (row.day) {
            lastDay = row.day;
            days[row.day] = [translatedRow]
          } else {
            days[lastDay].push(translatedRow);
          }
        });
      
        result.en = generateEvents('en', days);
        result.fr = generateEvents('fr', days);

      } else {
        result.en = rows.map(getTranslations).map(r => r.en);
        result.fr = rows.map(getTranslations).map(r => r.fr);
      }

      Object.keys(result).forEach(key => {
        fs.writeFileSync(`${DEST_FILE_BASENAME}_${key}.json`, JSON.stringify(result[key]));
      });    
      
      resolve();
    });
  })
  
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

async function downloadCsv(url, outputFilename) {
  const res = await fetch(url);
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(outputFilename);
    res.body.pipe(fileStream);
    res.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", function() {
      resolve();
    });
  });
}

// Festival helpers
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