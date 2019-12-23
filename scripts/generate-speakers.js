const fs = require('fs'),
      csvtojson = require('csvtojson')
      fetch = require('node-fetch');

const TMP_CSV = 'speakers.csv';
const SPREADSHEET_ID = '12vIWrL2DnrfRlEZ23PFwv4sJO-rGtbD95WWsjirNqTk';
const SHEET_ID = 1242995252;
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

    const speakers = [];

      rows.forEach(row => {
        speakers.push(row)
      });
    
      fs.writeFileSync(`${DESTINATION_FOLDER}/speakers.json`, JSON.stringify(speakers));
      resolve();
    });
  })
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