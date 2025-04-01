-- CreateEnum
CREATE TYPE "TalkType" AS ENUM ('TALK', 'WORKSHOP', 'PARTY', 'PROJECTION', 'STAND', 'MEET_UP', 'HACKATHON');

-- CreateTable
CREATE TABLE "Page" (
    "slug" TEXT NOT NULL,
    "content_en" TEXT NOT NULL DEFAULT '{}',
    "content_fr" TEXT NOT NULL DEFAULT '{}',

    CONSTRAINT "Page_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Event" (
    "slug" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "subtitle_en" TEXT NOT NULL,
    "subtitle_fr" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_fr" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "location_id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "github_issue_url" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Location" (
    "slug" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_fr" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Talk" (
    "slug" TEXT NOT NULL,
    "type" "TalkType" NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_fr" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_fr" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "github_issue_url" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "Talk_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Speaker" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headline_en" TEXT NOT NULL,
    "headline_fr" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "website_url" TEXT NOT NULL,
    "twitter_url" TEXT NOT NULL,
    "github_url" TEXT NOT NULL,
    "linkedin_url" TEXT NOT NULL,
    "facebook_url" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Speaker_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Organization" (
    "slug" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_fr" TEXT NOT NULL,
    "image_id" TEXT NOT NULL,
    "website_url" TEXT NOT NULL,
    "twitter_url" TEXT NOT NULL,
    "github_url" TEXT NOT NULL,
    "linkedin_url" TEXT NOT NULL,
    "facebook_url" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Tag" (
    "name" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_fr" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_filename" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventToOrganization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventToOrganization_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SpeakerToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SpeakerToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SpeakerToTalk" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SpeakerToTalk_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrganizationToSpeaker" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrganizationToSpeaker_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrganizationToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrganizationToTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TagToTalk" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TagToTalk_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventToOrganization_B_index" ON "_EventToOrganization"("B");

-- CreateIndex
CREATE INDEX "_EventToTag_B_index" ON "_EventToTag"("B");

-- CreateIndex
CREATE INDEX "_SpeakerToTag_B_index" ON "_SpeakerToTag"("B");

-- CreateIndex
CREATE INDEX "_SpeakerToTalk_B_index" ON "_SpeakerToTalk"("B");

-- CreateIndex
CREATE INDEX "_OrganizationToSpeaker_B_index" ON "_OrganizationToSpeaker"("B");

-- CreateIndex
CREATE INDEX "_OrganizationToTag_B_index" ON "_OrganizationToTag"("B");

-- CreateIndex
CREATE INDEX "_TagToTalk_B_index" ON "_TagToTalk"("B");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Talk" ADD CONSTRAINT "Talk_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Talk" ADD CONSTRAINT "Talk_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToOrganization" ADD CONSTRAINT "_EventToOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToOrganization" ADD CONSTRAINT "_EventToOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "Organization"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToTag" ADD CONSTRAINT "_EventToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToTag" ADD CONSTRAINT "_EventToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpeakerToTag" ADD CONSTRAINT "_SpeakerToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Speaker"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpeakerToTag" ADD CONSTRAINT "_SpeakerToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpeakerToTalk" ADD CONSTRAINT "_SpeakerToTalk_A_fkey" FOREIGN KEY ("A") REFERENCES "Speaker"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpeakerToTalk" ADD CONSTRAINT "_SpeakerToTalk_B_fkey" FOREIGN KEY ("B") REFERENCES "Talk"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToSpeaker" ADD CONSTRAINT "_OrganizationToSpeaker_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToSpeaker" ADD CONSTRAINT "_OrganizationToSpeaker_B_fkey" FOREIGN KEY ("B") REFERENCES "Speaker"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToTag" ADD CONSTRAINT "_OrganizationToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToTag" ADD CONSTRAINT "_OrganizationToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTalk" ADD CONSTRAINT "_TagToTalk_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TagToTalk" ADD CONSTRAINT "_TagToTalk_B_fkey" FOREIGN KEY ("B") REFERENCES "Talk"("slug") ON DELETE CASCADE ON UPDATE CASCADE;
