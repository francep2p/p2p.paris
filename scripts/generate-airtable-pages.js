const fs = require('fs'),
      path = require('path'),
      fetch = require('node-fetch');

const CHAPTER = 'Paris P2P';
const AIRTABLE_BASE_ID = 'appVBIJFBUheVWS0Q';
const {
  AIRTABLE_API_KEY
} = process.env;

main();

async function main() {
  const talks = (await fetchTable('Talk'))
    .filter(isPublished)
    .filter(item => item.chapter.indexOf(CHAPTER) > -1)
    .map(transformAirtableRecordsToPageProps)
    .filter(i => i);

  const speakers = (await fetchTable('Speaker'))
    .filter(item => item.chapters.indexOf(CHAPTER) > -1)
    .map(transformAirtableRecordsToPageProps)
    .filter(i => i);

  const events = (await fetchTable('Event'))
    .map(transformAirtableRecordsToPageProps)
    .filter(i => i);

  const tags = await fetchTable('Tag');  
  const chapters = await fetchTable('Chapter');
  
  speakers.forEach(async speaker => {
    try {
      if (speaker.picture) {
        await downloadImage(speaker.picture.remote);
      }
    } catch (err) {
      log(`Image download error: ${speaker.picture.remote}, ${err}`);
    }
  });

  const translated = splitToMultiLanguage([
    ...talks,
    ...speakers,
    ...events,
    ...chapters,
    ...tags
  ]);

  const en = joinRelations(translated.en);
  const fr = joinRelations(translated.fr);

  ['speaker', 'talk'].forEach(topic => {
    const enPages = filterDuplicates(en.filter(item => item.from_table === topic).filter(hasSlug));
    const frPages = filterDuplicates(fr.filter(item => item.from_table === topic).filter(hasSlug));
    generateMarkdownFiles(enPages);
    generateMarkdownFiles(frPages, 'fr');
  });

  const festivalEN = en.find(event => event.name == 'Paris P2P Festival #0');
  const festivalFR = fr.find(event => event.name == 'Paris P2P Festival #0');

  const festivalSpeakersEN = en
    .filter(item => item.from_table == 'speaker')
    .filter(item => item.in_paris_p2p__0_speakers_list);

  const festivalSpeakersFR = fr
    .filter(item => item.from_table == 'speaker')
    .filter(item => item.in_paris_p2p__0_speakers_list);

  fs.writeFileSync(path.join(__dirname, '../data/gen/festival', 'speakers_en.json'), JSON.stringify(festivalSpeakersEN, null, 2));
  fs.writeFileSync(path.join(__dirname, '../data/gen/festival', 'speakers_fr.json'), JSON.stringify(festivalSpeakersFR, null, 2));
  fs.writeFileSync(path.join(__dirname, '../data/gen/festival', 'events_en.json'), JSON.stringify(groupFestivalTalksByDay(festivalEN), null, 2));
  fs.writeFileSync(path.join(__dirname, '../data/gen/festival', 'events_fr.json'), JSON.stringify(groupFestivalTalksByDay(festivalFR), null, 2));
  
  function groupFestivalTalksByDay(festival) {
    T// ODO: Order talks by date/time
    let result = [];
    const days = {};
  
    festival.talks.forEach(talk => {
      if (!talk.day) return;
      if (days[talk.day]) {
        days[talk.day].push(talk);
      }
      else {
        days[talk.day] = [ talk ];
      }
    }); 

    Object.keys(days).forEach((date) => {
      result.push({
        date: date,
        events: days[date]
      });
    });

    return result;
  }

  function filterDuplicates(items) {
    const slugs = [];
    return items.filter(item => {
      if (slugs.includes(item)) {
        log(`WARNING: ${item.from_table} ${item.title} is duplicated`);
        return false;
      }
      slugs.push(item.slug)
      return true;
    });
  }

  function hasSlug(item) {
    if (item.slug) {
      return true;
    }

    log(`WARNING: ${item.from_table} ${item.title} doesn't have a slug`);
    return false;
  }

  function isPublished(item) {
    return item.published;
  }
}

function generateMarkdownFiles(items, langSuffix = '') {
  const suffix = langSuffix ? `.${langSuffix}.md` : '.md';
  items.forEach(item => {
    const filepath = path.join(__dirname, '../content', item.file_path, `index${suffix}`);
    const dirpath = path.dirname(filepath);

    fs.mkdirSync(dirpath, { recursive: true });
    fs.writeFileSync(filepath, JSON.stringify(item, null, 2));
    log(`Created file: ${filepath}`);
  });
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
      const value = item[key];
      let newValue = value;
      
      if (value instanceof Array) {
        newValue = value.map(v => {
          if (normalized[v]) {
            return normalized[v];
          }

          if (isId(v)) {
            log(`WARNING: ${item.from_table} ${item.title} referenced "${v}" as a relation, but is not found. Probably this is because it references a different chapter which is filtered out.`)
            return null;
          }

          return v;
        }).filter(i => i);
      } 
      else if (normalized[value]) {
        return normalized[value];
      }

      result[key] = newValue;
    });
  
    return result;
  })
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

    return flattenAirtableRecords(tableName, (await res.json()).records);
  } catch (error) {
    log({error})
    process.exit(1);
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

function isId(value) {
  if (typeof value != 'string') return false;
  return value.startsWith('rec') && value.length == 17;
}

function getImagePath(filepath, absolute = true) {
  const filename = path.basename(filepath);
  return absolute
    ? path.join(__dirname, `../assets/gen/img/${filename}`)
    : path.join(`/gen/img/${filename}`);
}

function log(message) {
  // console.log(message);
}

function flattenAirtableRecords(tableName, items) {
  return items.map(item => {
    let result = {};
    result.id = item.id;
    result.date = item.createdTime;
    result.from_table = tableName.toLowerCase();

    Object.keys(item.fields).forEach(key => {
      let value = item.fields[key];
      const newKey = key
        .toLowerCase()
        .replace(/\#/g, '_')
        .replace(/\(s\)/g, '_')
        .replace(/\s/g, '_');
      
      if (newKey == 'picture') {
        const url = value[0].thumbnails.large.url;
        value = { remote: url, local: getImagePath(url, false)};
      }
      
      result[newKey] = value;
    });

    return result;
  })
}

function transformAirtableRecordsToPageProps(item) {
  let title = '';
  let basedir = '';
  switch (item.from_table) {
    case 'talk':
      title = item['title_(en)']
      basedir = '/talks/';
      break;
    case 'speaker':
      title = item.name;
      basedir = '/speakers/'; 
      break;
    case 'event': 
      title = item.name;
      basedir = '/event/'; 
      break;
    case 'chapter': 
      title = item.name;
      basedir = '/chapters/'; 
      break;
    default:
      title = '';
      basedir = ''; 
  }

  if (!title) {
    return null;
  }

  item.title = title;
  item.file_path = `${basedir}${item.slug}`;

  return item;
}

async function downloadImage(url) {
  log(`Downloading image ${url}`);
  const filepath = getImagePath(url);
  fs.mkdirSync(path.dirname(filepath), { recursive: true });

  const res = await fetch(url);
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(filepath);
    res.body.pipe(fileStream);
    res.body.on("error", (err) => {
      reject(err);
    });
    fileStream.on("finish", function() {
      resolve();
    });
  });
}