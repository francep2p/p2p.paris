const fs = require('fs'),
      path = require('path'),
      fetch = require('node-fetch');

const AIRTABLE_BASE_ID = 'appVBIJFBUheVWS0Q';
const {
  AIRTABLE_API_KEY
} = process.env;

main();

async function main() {
  const talks = await fetchTable('Talk');
  const speakers = await fetchTable('Speaker');
  const events = await fetchTable('Event');

  console.log({ talks, speakers, events });
}

async function fetchTable(tableName) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const json = await res.json()
    return normalizeArray(json.records);
  } catch (error) {
    throw Error(error);
  }
}

// helper
function normalizeArray(items) {
  let result = {};
  items.forEach(item => { result[item.id] = item; });
  return result;
}