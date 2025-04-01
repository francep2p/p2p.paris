import {
  defaultEvent,
  defaultLocation,
  defaultOrganization,
  defaultSpeaker,
  defaultTalk,
} from "@/scripts/types";
import { saveFileInBucket } from "@/utils/back/files";
import {
  Event,
  Location,
  Organization,
  PrismaClient,
  Speaker,
  Talk,
  TalkType,
} from "@prisma/client";
import fs from "fs/promises";
import { nanoid } from "nanoid";
import { defaultPagesContent } from "../utils/pageTypes";
import downloadAirtableData from "./fetch-airtable-data";
const IMAGES_BUCKET_NAME = process.env.S3_BUCKET_NAME;

if (!IMAGES_BUCKET_NAME) {
  throw new Error("S3_BUCKET_NAME en var is not defined");
}

const S3_ENDPOINT = process.env.S3_ENDPOINT;

if (!S3_ENDPOINT) {
  throw new Error("S3_ENDPOINT en var is not defined");
}

const S3_PORT = process.env.S3_PORT;

if (!S3_PORT) {
  throw new Error("S3_PORT en var is not defined");
}

const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;

if (!S3_ACCESS_KEY) {
  throw new Error("S3_ACCESS_KEY en var is not defined");
}

const S3_SECRET_KEY = process.env.S3_SECRET_KEY;

if (!S3_SECRET_KEY) {
  throw new Error("S3_SECRET_KEY en var is not defined");
}

const S3_USE_SSL = process.env.S3_USE_SSL;

if (!S3_USE_SSL) {
  throw new Error("S3_USE_SSL en var is not defined");
}

const getFileExtension = (filename: string) => {
  const lastDotIndex = filename.lastIndexOf(".");
  return lastDotIndex !== -1 ? filename.substring(lastDotIndex + 1) : "";
};

const createPages = async (db: PrismaClient) => {
  for (const page of Object.keys(defaultPagesContent)) {
    // @ts-ignore - each page has a different type
    // which we don't need to explicit here
    const contentEn = defaultPagesContent[page]["en"];
    // @ts-ignore - each page has a different type
    // which we don't need to explicit here
    const contentFr = defaultPagesContent[page]["fr"];

    await db.page.upsert({
      where: {
        slug: page,
      },
      create: {
        slug: page,
        content_en: JSON.stringify(contentEn),
        content_fr: JSON.stringify(contentFr),
      },
      update: {
        content_en: JSON.stringify(contentEn),
        content_fr: JSON.stringify(contentFr),
      },
    });
  }
};

const createImageId = async (
  db: PrismaClient,
  localPath: string,
  name: string,
): Promise<string> => {
  // 0. Check if image already exists
  const c = await db.image.findFirst({
    where: {
      original_filename: name,
    },
  });

  if (c) {
    return c.id;
  }

  // 1. Load local image
  const file: Buffer = await fs.readFile(`${localPath}`);
  const ext = getFileExtension(localPath);
  // 2. Create image by posting on /api/images
  // generate unique file name
  const filename = `${nanoid(5)}-${name}${ext ? `.${ext}` : ""}`;
  // Save file to S3 bucket and save file info to database concurrently
  await saveFileInBucket({
    bucketName: IMAGES_BUCKET_NAME,
    filename,
    file,
  });
  // save file info to database
  const image = await db.image.create({
    data: {
      original_filename: name,
      filename,
      bucket: IMAGES_BUCKET_NAME,
    },
  });

  return image.id;
};

const upsertTalk = async (db: PrismaClient, talk: Talk): Promise<Talk> => {
  return db.talk.upsert({
    where: {
      slug: talk.slug,
    },
    create: talk,
    update: talk,
  });
};

const upsertSpeaker = async (db: PrismaClient, speaker: Speaker) => {
  return db.speaker.upsert({
    where: {
      slug: speaker.slug,
    },
    create: speaker,
    update: speaker,
  });
};

const upsertEvent = async (db: PrismaClient, event: Event) => {
  return db.event.upsert({
    where: {
      slug: event.slug,
    },
    create: event,
    update: event,
  });
};

const upsertLocation = async (db: PrismaClient, location: Location) => {
  return db.location.upsert({
    where: {
      slug: location.slug,
    },
    create: location,
    update: location,
  });
};

const loadAirtableData = async (db: PrismaClient) => {
  // image to use if items has no image
  const fillerImgId = await createImageId(
    db,
    "./public/images/filler.svg",
    "filler.svg",
  );

  const en = JSON.parse(
    await fs.readFile("./data/gen/airtable_en.json", "utf-8"),
  );
  const fr = JSON.parse(
    await fs.readFile("./data/gen/airtable_fr.json", "utf-8"),
  );

  // For simplicity with relation management, we will base our fetching of data based
  // on the talks. Any speaker, event, location, organization, or tag that is
  // not associated with a talk will not be populated into database.
  for (const [key, value] of Object.entries(en as { [key: string]: any })) {
    if (value.from_table === "talk") {
      // @ts-ignore
      const t: Talk & { speakers: { connect: { slug: string }[] } } = {
        ...defaultTalk,
      };

      t.slug = value.slug;
      t.type =
        TalkType[en[value.kind].name.toUpperCase() as keyof typeof TalkType];
      t.start_date = new Date(value.start_date || 0);
      t.end_date = new Date(value.end_date || 0);
      t.title_en = en[key].title;
      t.title_fr = fr[key].title || t.title_en;
      t.description_en = en[key].description || "";
      t.description_fr = fr[key].description || "";
      t.github_issue_url = en[key].github_issue || "";
      t.video_url = en[key].talk_youtube_url || "";

      if (value.talk_youtube_preview_image?.length > 0) {
        t.video_thumbnail_image_id = await createImageId(
          db,
          `./assets${value.talk_youtube_preview_image[0].local}`,
          t.slug,
        );
      } else {
        t.video_thumbnail_image_id = fillerImgId;
      }

      // Create related speakers
      const speakers = [];
      for (const speakerId of value.speaker_ || []) {
        const speakerEn = en[speakerId];
        const speakerFr = fr[speakerId];

        const s = defaultSpeaker;

        s.slug = speakerEn.slug;
        s.name = speakerEn.name;
        s.headline_en = speakerEn.headline || "";
        s.headline_fr = speakerFr.headline || "";
        s.twitter_url = speakerEn.twitter || "";
        s.github_url = speakerEn.github || "";
        s.linkedin_url = speakerEn.linkedin || "";
        s.email = speakerEn.email || "";
        s.facebook_url = speakerEn.facebook || "";

        if (speakerEn.picture?.length) {
          s.image_id = await createImageId(
            db,
            `./assets${speakerEn.picture[0].local}`,
            s.slug,
          );
        } else {
          s.image_id = fillerImgId;
        }

        const speaker = await upsertSpeaker(db, s);
        speakers.push(speaker);

        // Create related organizations
        for (const organizationId of speakerEn.organization || []) {
          const organizationEn = en[organizationId];
          const organizationFr = fr[organizationId];

          const o: Organization = { ...defaultOrganization };

          o.slug = organizationEn.name.toLowerCase().replace(" ", "-");
          o.name_en = organizationEn.name;
          o.name_fr = organizationFr.name;
          o.website_url = organizationEn.link || "";

          if (organizationEn.logo) {
            o.image_id = await createImageId(
              db,
              `./assets${organizationEn.logo[0].local}`,
              o.slug,
            );
          }

          const org = await db.organization.upsert({
            where: {
              slug: o.slug,
            },
            create: o,
            update: o,
          });

          await db.speaker.update({
            where: {
              slug: speaker.slug,
            },
            data: {
              organizations: {
                connect: {
                  slug: org.slug,
                },
              },
            },
          });
        }
      }

      // Create related events
      for (const eventId of value.event) {
        const eventEn = en[eventId];
        const eventFr = fr[eventId];

        const e: Event = { ...defaultEvent };

        e.slug = eventEn.slug;
        e.description_en = eventEn.description || "";
        e.description_fr = eventFr.description || "";
        e.start_date = new Date(eventEn.start_date || 0);
        e.end_date = new Date(eventEn.end_date || 0);
        e.name_en = eventEn.name;
        e.name_fr = eventFr.name;
        e.link = eventEn.meetup_com_link || "";
        e.subtitle_en = eventEn.subtitle;
        e.subtitle_fr = eventFr.subtitle;
        e.github_issue_url = eventEn.github_issue || "";

        if (e.slug === "festival-2") {
          e.active = true;
        }

        if (eventEn.picture.length) {
          e.image_id = await createImageId(
            db,
            `./assets${eventEn.picture[0].local}`,
            e.slug,
          );
        } else {
          e.image_id = fillerImgId;
        }

        // we treat places as locations
        if (eventEn.place.length) {
          const locationId = eventEn.place[0];

          const l = defaultLocation;

          l.slug = en[locationId].name.toLowerCase().replace(" ", "-");

          l.name_en = en[locationId].name;
          l.name_fr = fr[locationId].name;

          l.address = `${en[locationId].address}, ${en[locationId].city}, ${en[locationId].postal_code}, ${en[locationId].region}, ${en[locationId].country}`;

          const location = await upsertLocation(db, l);
          e.location_id = location.slug;
        }

        const event = await upsertEvent(db, e);
        t.event_id = event.slug;
      }

      // Create related locations
      if (value.location.length) {
        const locationId = value.location[0];
        const l: Location = defaultLocation;

        l.slug = en[locationId].name.toLowerCase().replace(" ", "-");

        if (en[locationId].place.length) {
          const p = en[en[locationId].place[0]];

          l.address = `${p.address}, ${p.city}, ${p.postal_code}, ${p.region}, ${p.country}`;
          l.slug = `${p.name.toLowerCase().replace(" ", "-")}-${l.slug}`;
        }

        l.name_en = en[locationId].name;
        l.name_fr = fr[locationId].name;

        l.address = `${en[locationId].address}, ${en[locationId].city}, ${en[locationId].postal_code}, ${en[locationId].region}, ${en[locationId].country}`;

        if (en[locationId].plan?.length) {
          l.image_id = await createImageId(
            db,
            `./assets${en[locationId].plan[0].local}`,
            l.slug,
          );
        }

        const location = await upsertLocation(db, l);
        t.location_id = location.slug;
      }

      t.speakers = {
        connect: speakers.map((s) => ({
          slug: s.slug,
        })),
      };
      await upsertTalk(db, t);
    }
  }
};

export default async function populateDb() {
  const db = new PrismaClient();

  // 1 - Create pages from default data

  if (process.env.LOAD_PAGE === "true") {
    await createPages(db);
  }

  if (process.env.LOAD_AIRTABLE === "true") {
    // 2. Download airtable data locally

    await downloadAirtableData();

    // 3. Load data from airtable to db

    await loadAirtableData(db);

    // 4. Cleanup

    await fs.rm("./data", { recursive: true, force: true });
    await fs.rm("./assets", { recursive: true, force: true });
  }

  await db.$disconnect();
}

populateDb()
  .catch((e) => {
    throw e;
  })
  .then(async () => {
    console.log("[+] Database populated");
  });
