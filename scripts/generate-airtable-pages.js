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
  const chapters = await fetchTable('Chapter');

  const translated = splitToMultiLanguage([
    ...talks,
    ...speakers,
    ...events,
    ...chapters
  ]);

  const en = joinRelations(translated.en);
  const fr = joinRelations(translated.fr);

  ['speaker', 'talk'].forEach(topic => {
    generateMarkdownFiles(en.filter(item => item.from_table === topic));
    generateMarkdownFiles(fr.filter(item => item.from_table === topic), 'fr');
  });
}

function generateMarkdownFiles(items, langSuffix = '') {
  const suffix = langSuffix ? `.${langSuffix}.md` : '.md';
  items.forEach(item => {
    const filepath = path.join(__dirname, '../content', item.file_path, `index${suffix}`);
    const dirpath = path.dirname(filepath);

    fs.mkdirSync(dirpath, { recursive: true });
    fs.writeFileSync(filepath, JSON.stringify(item, null, 2));
    console.log(`Created file: ${filepath}`);
  })
}

function splitToMultiLanguage(items) {
  let result = { en: [], fr: [] };

  items.forEach(item => {
    let translations = { en: {}, fr: {} };

    Object.keys(item).forEach(key => {
      const value = item[key];
      if (isTranslated(key)) {
        const lang = getLanguage(key);
        translations[lang][removeLanguageKey(key)] = value;
      } else {
        translations.en[key] = value;
        translations.fr[key] = value;
      }
    });

    result.en.push(translations.en);
    result.fr.push(translations.fr);
  });

  return result;
}

function joinRelations(items) {
  const normalized = normalizeArray(items)

  return items.map(item => {
    let result = {};

    Object.keys(item).forEach(key => {
      let newValue;
      const value = item[key];

      if (value instanceof Array) {
        newValue = value.map(v => {
          return normalized[v]
            ? relationObj(normalized[v])
            : v;
        });
      } 
      else if (normalized[value]) {
        return relationObj(normalized[value]);
      }
      else {
        newValue = value;
      }

      result[key] = newValue;
    });
  
    return result;
  })

  function relationObj(record) {
    return { id: record.id, path: record.file_path };
  }
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

    return transformAirtableResponse(tableName, (await res.json()).records);
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

function isTranslated(key) {
  return key.lastIndexOf('(en)') > -1 || key.lastIndexOf('(fr)')  > -1;
}

function getLanguage(key) {
  return key.substring(
    key.lastIndexOf("(") + 1, 
    key.lastIndexOf(")")
  );
}

function removeLanguageKey(key) {
  const lang = getLanguage(key);
  return key.replace(`_(${lang})`, '');
}

function transformAirtableResponse(tableName, records) {
  return records.map(item => {
    let result = {};
    result.id = item.id;
    result.date = item.createdTime;
    result.from_table = tableName.toLowerCase();

    Object.keys(item.fields).forEach(key => {
      const newKey = key
        .toLowerCase()
        .replace(/\#/g, '_')
        .replace(/\(s\)/g, '_')
        .replace(/\s/g, '_');
      result[newKey] = item.fields[key];
    });

    let title = '';
    let basedir = '';
    switch (result.from_table) {
      case 'talk':
        title = result['title_(en)']
        basedir = '/talks/';
        break;
      case 'speaker':
        title = result.name;
        basedir = '/speakers/'; 
        break;
      case 'event': 
        title = result.name;
        basedir = '/event/'; 
        break;
      case 'chapter': 
        title = result.name;
        basedir = '/chapters/'; 
        break;
      default:
        title = '';
        basedir = ''; 
    }

    if (!title) {
      return null;
    }

    result.title = title;

    const filename = title.replace(/\s/g, '-').toLowerCase();
    result.file_path = `${basedir}${filename}`;

    return result;
  }).filter(item => item);
}