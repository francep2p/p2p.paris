import {
  ClientEvent,
  ClientOrganization,
  ClientSpeaker,
  ClientTalk,
  GroupedTalks,
} from "@/types/client";
import { Event, Location, Organization, Speaker, Talk } from "@prisma/client";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

import { Locale } from "./pageTypes";

export const groupTalksByDay = (talks: ClientTalk[]): GroupedTalks[] => {
  const groupedTalks = talks.reduce<GroupedTalks[]>((acc, talk) => {
    const eventDate = dayjs(talk.startDateTime)
      .tz("Europe/Berlin")
      .format("YYYY-MM-DD");
    const dayIndex = acc.findIndex((day) => day.date === eventDate);

    if (dayIndex > -1) {
      acc[dayIndex].talks.push(talk);
      acc[dayIndex].talks.sort((a, b) =>
        dayjs(a.startDateTime)
          .tz("Europe/Berlin")
          .diff(dayjs(b.startDateTime).tz("Europe/Berlin")),
      );
    } else {
      acc.push({
        day: acc.length,
        date: eventDate,
        talks: [talk],
      });
    }

    return acc;
  }, []);

  return groupedTalks.sort((a, b) =>
    dayjs(a.date).tz("Europe/Berlin").diff(dayjs(b.date).tz("Europe/Berlin")),
  );
};

export const formatClientSpeaker = (
  speaker: Speaker & { talks?: Talk[] },
  locale: Locale,
): ClientSpeaker => ({
  slug: speaker.slug,
  name: speaker.name,
  desc: speaker[`headline_${locale}`] || "",
  image: speaker.image_id || "",
  social: {
    website: speaker.website_url,
    twitter: speaker.twitter_url,
    email: speaker.email,
    github: speaker.github_url,
    linkedIn: speaker.linkedin_url,
  },
  talks: speaker?.talks?.map?.((item) => formatClientTalk(item, locale)) || [],
});

export const formatClientOrganization = (
  org: Organization,
  locale: Locale,
): ClientOrganization => ({
  slug: org.slug,
  name: org[`name_${locale}`] || "",
  description: org[`description_${locale}`] || "",
  image: org.image_id,
});

export const formatClientTalk = (
  talk: Talk & {
    event?: Event & { location?: Location };
    speakers?: Speaker[];
  },
  locale: Locale,
): ClientTalk => ({
  slug: talk.slug,
  startDateTime: dayjs(talk.start_date)
    .tz("Europe/Berlin")
    .format("YYYY-MM-DDTHH:mm:ssZ"),
  endDateTime: dayjs(talk.end_date)
    .tz("Europe/Berlin")
    .format("YYYY-MM-DDTHH:mm:ssZ"),
  language: "EN",
  location: talk?.event?.location?.[`name_${locale}`] || "N/A",
  speakers:
    talk?.speakers?.map?.((speaker) => formatClientSpeaker(speaker, locale)) ||
    [],
  image: talk?.video_thumbnail_image_id || talk?.event?.image_id || "",
  title: talk[`title_${locale}`] || "",
  description: talk[`description_${locale}`] || "",
  type: talk.type,
  videoUrl: talk.video_url,
});

export const formatClientEvent = (
  event: Event & {
    location?: Location;
    talks?: (Talk & { speakers: Speaker[] })[];
    sponsors?: Organization[];
  },
  locale: Locale,
): ClientEvent => {
  const allSpeakers = event?.talks?.flatMap?.((event) => event?.speakers) || [];

  const uniqueSpeakers = Array.from(
    allSpeakers
      .reduce((map, speaker) => map.set(speaker.slug, speaker), new Map())
      .values(),
  );

  return {
    slug: event.slug,
    image: event.image_id,
    active: event.active,
    link: event.link,
    name: event[`name_${locale}`] || "",
    description: event[`description_${locale}`] || "",
    startDateTime: dayjs(event.start_date)
      .tz("Europe/Berlin")
      .format("YYYY-MM-DDTHH:mm:ssZ"),
    endDateTime: dayjs(event.end_date)
      .tz("Europe/Berlin")
      .format("YYYY-MM-DDTHH:mm:ssZ"),
    location: event?.location?.[`name_${locale}`] || "",
    talks: event?.talks?.map?.((item) => formatClientTalk(item, locale)) || [],
    speakers: uniqueSpeakers.map((speaker) =>
      formatClientSpeaker(speaker, locale),
    ),
    sponsors:
      event?.sponsors?.map?.((item) =>
        formatClientOrganization(item, locale),
      ) || [],
  };
};

export const getSpeakersString = (speakers: ClientSpeaker[]) => {
  const names = speakers.map((obj) => obj.name);
  return names.length > 1
    ? `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`
    : names[0];
};

export const downloadCalendarICS = (event: ClientEvent) => {
  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.name}
DESCRIPTION:${event.description}
LOCATION:${event.location}
DTSTART:${dayjs(event.startDateTime).tz("Europe/Berlin").utc().format("YYYYMMDDTHHmmss") + "Z"}
DTEND:${dayjs(event.endDateTime).tz("Europe/Berlin").utc().format("YYYYMMDDTHHmmss") + "Z"}
END:VEVENT
END:VCALENDAR
  `.trim();

  const blob = new Blob([icsContent], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.name}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
