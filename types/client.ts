import { $Enums } from "@prisma/client";
export interface ClientTalk {
  slug: string;
  type: $Enums.TalkType;
  startDateTime: string;
  endDateTime: string;
  language: string;
  location: string;
  speakers: ClientSpeaker[];
  image: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface ClientSpeaker {
  slug: string;
  name: string;
  desc: string;
  image: string;
  social: {
    website?: string;
    twitter?: string;
    github?: string;
    linkedIn?: string;
    facebook?: string;
    email?: string;
  };
  talks: ClientTalk[];
}

export interface GroupedTalks {
  day: number;
  date: string;
  talks: ClientTalk[];
}

export interface ClientOrganization {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface ClientEvent {
  slug: string;
  name: string;
  image: string;
  link: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  talks: ClientTalk[];
  speakers: ClientSpeaker[];
  sponsors: ClientOrganization[];
  active: boolean;
}
