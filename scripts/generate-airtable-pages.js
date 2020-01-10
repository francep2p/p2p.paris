const fs = require('fs'),
      path = require('path'),
      fetch = require('node-fetch'),
      mime = require('mime');

const CHAPTER = 'Paris P2P';
const AIRTABLE_BASE_ID = 'appVBIJFBUheVWS0Q';
const {
  AIRTABLE_API_KEY
} = process.env;

main();

async function main() {
  let talks, speakers, events, tags, chapters, talkKind, settings, organizations, locations;

  try {
    talks = (await fetchTable('Talk'))
      .filter(isPublished)
      .filter(item => item.chapter && item.chapter.indexOf(CHAPTER) > -1)
      .map(addPageProps)
      .filter(i => i);

    speakers = (await fetchTable('Speaker'))
      .filter(item => item.chapters && item.chapters.indexOf(CHAPTER) > -1)
      .map(addPageProps)
      .filter(i => i);

    events = (await fetchTable('Event'))
      .map(addPageProps)
      .filter(i => i);

    tags = await fetchTable('Tag');
    chapters = await fetchTable('Chapter');
    talkKind = await fetchTable('Talk%20Kind');
    settings = await fetchTable('Settings');
    organizations = await fetchTable('Organization');
    locations = await fetchTable('Location');
  } catch (error) {
    log(`ERROR ${error}`);
    process.exit(1);
  }

  const entities = [
    ...talks,
    ...speakers,
    ...events,
    ...chapters,
    ...tags,
    ...talkKind,
    ...settings,
    ...organizations,
    ...locations
  ]

  const translated = splitToMultiLanguage(entities);

  await Promise.all([
    downloadImagesFromItems(speakers),
    downloadImagesFromItems(talks)
  ]);

  const defaultLanguage = 'en';
  ['en', 'fr'].forEach(lang => {
    // Join relations. 1 level deep
    const joined = joinRelations(translated[lang]);

    // Create normalized .Data.gen.airtable_LANG.json file with all entities
    generateDataFile(
      `airtable_${lang}.json`,
      normalizeArray(translated[lang])
    );

    // Create settings data file in .Data.gen.settings_LANG.json file
    generateDataFile(
      `settings_${lang}.json`,
      normalizeArray(translated[lang].filter(item => item.from_table == 'settings'), 'key')
    );

    // create Festival data
    createFestivalData(
      lang,
      joined.find(event => event.name == 'Paris P2P Festival #0'),
      joined.filter(item => item.from_table == 'speaker').filter(item => item.in_paris_p2p__0_speakers_list),
    );

    // Create pages
    ['speaker', 'talk'].forEach(topic => {
      const langSuffix = (lang != defaultLanguage ? lang : '')
      generateMarkdownFiles(joined.filter(item => item.from_table === topic), langSuffix);
    });
  });
}

function addPageProps(item) {
  let title = '';
  let basedir = '';
  switch (item.from_table) {
    case 'talk':
      // No need to define here, as it has a multi language title title_(en) title_(fr)
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

  if (title) {
    item.title = title;
  }
  else if (!title && !item['title_(en)'] && !item['title_(fr)']) {
    log(`WARNING ${item.from_table} ${item} doesn't have a title`);
    return null;
  }

  item.file_path = `${basedir}${item.slug}`;

  return item;
}


//
// Create festival data
//
function createFestivalData(lang, festival, speakers) {
  if (!festival) {
    log(`WARNING festival data not found`);
  }

  generateDataFile(`festival/speakers_${lang}.json`, speakers);
  generateDataFile(`festival/events_${lang}.json`, groupFestivalTalksByDay(festival));

  function groupFestivalTalksByDay(festival) {
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
      const events = days[date];
      events.sort((a,b) => {
        return a.weight - b.weight;
      });

      result.push({ date, events });
    });

    return result;
  }
}


//
// Filters
//
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


//
// Airtable
//
async function fetchTable(tableName) {
  let records = [];
  await _fetchTable();
  
  async function _fetchTable(offset) {
    let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}`;
        url = offset ? `${url}?offset=${offset}`: url;

    const headers = {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    };

    await fetch(url, { headers })
      .then(checkStatus)
      .then(res => {
        records = [ ...records, ...flattenAirtableRecords(tableName, res.records)];
        if (res.offset) {
          return _fetchTable(res.offset);
        }

        return records;
      })
      .catch(error => {
        log(`AIRTABLE ERROR: ${error}`);
        process.exit(2);
      })

    async function checkStatus(res) {
      if (res.ok) {
        return res.json();
      } else {
        log(`AIRTABLE ERROR: ${res.statusText}`);
        process.exit(3);
      }
    }
  }

  return records;
}

function flattenAirtableRecords(tableName, items) {
  return items.map(item => {
    let result = {};
    result.id = item.id;
    result.date = item.createdTime;
    result.from_table = tableName.toLowerCase();

    Object.keys(item.fields).forEach(key => {
      let value = item.fields[key];
      let newKey = key
        .toLowerCase()
        .replace(/\#/g, '_')
        .replace(/\(s\)/g, '_')
        .replace(/\s/g, '_');

      // if key already exists, prefix it
      if (result[newKey]) {
        newKey = `at_${newKey}`;
      }

      try {
        if (newKey == "json_(fr)") {
          result["parsed_json_(fr)"] = JSON.parse(value);
        }
        if (newKey == "json_(en)") {
          result["parsed_json_(en)"] = JSON.parse(value);
        }
      } catch (err) {
        log(`Parse JSON error: ${newKey}, ${value}`);
      }

      // if is file
      if (value instanceof Array) {
        value = value.map(item => {
          if (item && item.filename) {
            const url = item.url;
            const extension = mime.getExtension(item.type);

            if (!extension) {
              log(`WARNING: file extension unknown for ${item.type}`);
            }

            return { 
              isfile: true,
              filename: item.filename,
              size: item.size,
              is_image: true, 
              type: item.type,
              remote: url, 
              local: getImagePath(`${item.id}-${item.filename.replace(/\s/g, '_')}.${extension}`, false)
            };
          }
          return item;
        })
      }

      result[newKey] = value;
    });

    return result;
  })
}

//
// Language
//
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


//
// Generate Data file
//
function generateDataFile(filepath, obj) {
  const fullpath = path.join(__dirname, '../data/gen', filepath);
  fs.mkdirSync(path.dirname(fullpath), { recursive: true });
  fs.writeFileSync(fullpath, JSON.stringify(obj, null, 2));
}


//
// Generate markdown files
//
function generateMarkdownFiles(items, langSuffix = '') {
  const _items = filterDuplicates(items.map(safeFrontmatterProps).filter(hasSlug));
  const suffix = langSuffix ? `.${langSuffix}.md` : '.md';
  _items.forEach(item => {
    const filepath = path.join(__dirname, '../content', item.file_path, `index${suffix}`);
    const dirpath = path.dirname(filepath);

    fs.mkdirSync(dirpath, { recursive: true });
    fs.writeFileSync(filepath, JSON.stringify(item, null, 2));
    log(`Created file: ${filepath}`);
  });
}

function safeFrontmatterProps(item) {
  const prefix = 'at_';
  const reservedsKeys = ['tags'];
  Object.keys(item).forEach(key => {
    if (reservedsKeys.includes(key)) {
      item[`${prefix}${key}`] = item[key];
      delete item[key];
    }
  });
  return item;
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


//
// Relations
//
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



//
// Download images
//
async function downloadImagesFromItems(items) {
  const promises = [];

  items.forEach(item => {
    Object.keys(item).forEach(key => {
      const value = item[key];
      if (value instanceof Array) {
        value.forEach(v => {
          if (v && v.isfile) {
            promises.push(downloadImage(v.remote, v.local));
          }
        })
      }
    })
  });

  try {
    await Promise.all(promises);
    return;
  } catch (err) {
    log(`Images download error: ${err}`);
    process.exit(4);
  }
}

async function downloadImage(url, destination) {
  log(`Downloading image ${url}`);
  const filepath = getImagePath(destination);
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


//
// Other helpers
//
function normalizeArray(items, key = 'id') {
  let result = {};
  items.forEach(item => { 
    if (!item[key]) {
      log(`WARNING item - ${item.id} - doesn't have the property ${key}`)
      return;
    }

    result[item[key]] = item;
   });
  return result;
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
  console.log(message);
}
