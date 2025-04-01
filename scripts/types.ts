export type ItemTab = "editor" | "preview-en" | "preview-fr";

export type EditorFocusedItemType =
  | "page"
  | "event"
  | "location"
  | "speaker"
  | "talk"
  | "organization";

export type SpeakerEditorContent = {
  slug: string;
  name: string;
  headline_en: string;
  headline_fr: string;
  image_id: string;
  website_url: string;
  twitter_url: string;
  github_url: string;
  linkedin_url: string;
  facebook_url: string;
  email: string;
};

export const defaultSpeaker: SpeakerEditorContent = {
  slug: "new",
  name: "",
  headline_en: "",
  headline_fr: "",
  image_id: "",
  website_url: "",
  twitter_url: "",
  github_url: "",
  linkedin_url: "",
  facebook_url: "",
  email: "",
};

export type OrganizationEditorContent = {
  slug: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  image_id: string;
  website_url: string;
  twitter_url: string;
  github_url: string;
  linkedin_url: string;
  facebook_url: string;
  speakers?: SpeakerEditorContent[];
  tags?: string[];
  events?: EventEditorContent[];
};

export const defaultOrganization: OrganizationEditorContent = {
  slug: "new",
  name_en: "",
  name_fr: "",
  description_en: "",
  description_fr: "",
  image_id: "",
  website_url: "",
  twitter_url: "",
  github_url: "",
  linkedin_url: "",
  facebook_url: "",
};

export type EventEditorContent = {
  slug: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  start_date: Date;
  end_date: Date;
  speakers?: SpeakerEditorContent[];
  talks?: TalkEditorContent[];
  image_id: string;
  location_id: string;
  subtitle_en: string;
  subtitle_fr: string;
  link: string;
  github_issue_url: string;
  active: boolean;
};

export const defaultEvent: EventEditorContent = {
  slug: "new",
  name_en: "",
  name_fr: "",
  description_en: "",
  description_fr: "",
  start_date: new Date(0),
  end_date: new Date(0),
  image_id: "",
  location_id: "",
  subtitle_en: "",
  subtitle_fr: "",
  link: "",
  github_issue_url: "",
  active: false,
};

export type TalkType =
  | "TALK"
  | "WORKSHOP"
  | "PARTY"
  | "PROJECTION"
  | "STAND"
  | "MEET_UP";

export type TalkEditorContent = {
  slug: string;
  type: TalkType;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  start_date: Date;
  end_date: Date;
  video_url?: string;
  video_thumbnail_image_id?: string;
  speakers?: SpeakerEditorContent[];
  tags?: string[];
  event_id: string;
  location_id: string;
  github_issue_url: string;
};

export const defaultTalk: TalkEditorContent = {
  slug: "new",
  type: "TALK",
  title_en: "",
  title_fr: "",
  description_en: "",
  description_fr: "",
  start_date: new Date(0),
  end_date: new Date(0),
  event_id: "",
  location_id: "",
  video_url: "",
  video_thumbnail_image_id: "",
  github_issue_url: "",
};

export type LocationEditorContent = {
  slug: string;
  name_en: string;
  name_fr: string;
  image_id: string;
  description_en: string;
  description_fr: string;
  address: string;
  events?: EventEditorContent[];
};

export const defaultLocation: LocationEditorContent = {
  slug: "new",
  name_en: "",
  name_fr: "",
  image_id: "",
  description_en: "",
  description_fr: "",
  address: "",
};
