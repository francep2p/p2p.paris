import { Page } from "@/components/Page";

import { Event as EventComponent } from "@/components/Event";
import { HomeCoOrg } from "@/components/sections/home/co-org";
import { HomeDonate } from "@/components/sections/home/donate";
import { HomeEventsHighlights } from "@/components/sections/home/event-highlights";
import { HomeInformation } from "@/components/sections/home/information";
import { HomePlan } from "@/components/sections/home/plan";
import { HomeSchedule } from "@/components/sections/home/schedule";
import { HomeSpeakers } from "@/components/sections/home/speakers";
import TextureSeparatorComponent from "@/components/ui/texture-separator";
import { ClientEvent } from "@/types/client";
import { CommonTypes, HomePage, Locale } from "@/utils/pageTypes";
import Head from "next/head";

import { db } from "@/utils/back/db";
import { formatClientEvent } from "@/utils/helpers";
import { NextSeo } from "next-seo";
const Separator = ({ className = "" }: { className?: string }) => (
  <div className={`border w-full border-[#282828] mt-10 ${className}`}></div>
);

export default function Event({
  event,
  content,
  commonContent,
  activeEvent,
}: {
  content: HomePage;
  commonContent: CommonTypes;
  event: ClientEvent;
  activeEvent: ClientEvent;
}) {
  return (
    <Page
      meta={() => (
        <Head>
          <title>{event.name}</title>
        </Head>
      )}
      event={activeEvent}
      common={commonContent}
    >
      <NextSeo
        title={`${event.name} - Paris P2P`}
        description={
          event.description ||
          "Discover hundreds of talks on P2P, Cryptography, Privacy and more."
        }
        canonical={`https://paris.p2p/events/${event.slug}`}
      />
      <EventComponent content={content} event={event} />
      <TextureSeparatorComponent className="border-0 border-b-[1px] border-r-[1px]" />

      <HomeEventsHighlights
        totalEvents={event.talks.length}
        totalSpeakers={event.speakers.length}
        totalLocation={1}
        startDateTime={event.startDateTime}
        endDateTime={event.endDateTime}
        location={event.location}
      />
      <HomeSchedule content={content} talks={event.talks} />
      <HomeCoOrg content={content} sponsors={event.sponsors} />
      <HomeDonate content={content} />
      <Separator />
      <HomeSpeakers
        content={content}
        speakers={event.speakers}
        commonContent={commonContent}
      />
      <Separator />
      <HomeInformation content={content} />
      <Separator className="mt-20" />
      <HomePlan content={content} />
    </Page>
  );
}
export async function getStaticPaths() {
  const prisma = db;
  const events = await prisma.event.findMany({
    select: {
      slug: true,
    },
  });

  const paths = events.flatMap((event) => [
    { params: { slug: event.slug }, locale: "en" },
    { params: { slug: event.slug }, locale: "fr" },
  ]);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({
  locale,
  params: { slug },
}: {
  locale: Locale;
  params: { slug: string };
}) {
  const prisma = db;

  const event = await prisma.event.findUnique({
    where: {
      slug: slug,
    },
    include: {
      talks: {
        include: {
          speakers: true,
        },
      },
      sponsors: true,
      location: true,
    },
  });

  const activeEvent = await prisma.event.findFirst({
    where: {
      active: true,
    },
  });

  if (event && !event?.sponsors.length) {
    event.sponsors = await prisma.organization.findMany({
      take: 10,
      where: {
        image_id: {
          not: "",
        },
      },
    });
  }

  const page = await prisma.page.findUnique({
    where: {
      slug: "home",
    },
  });

  const commonPage = await prisma.page.findUnique({
    where: {
      slug: "common",
    },
  });

  if (!event || !page || !commonPage || !activeEvent) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      content: JSON.parse(locale === "en" ? page.content_en : page.content_fr),
      commonContent: JSON.parse(
        locale === "fr" ? commonPage.content_fr : commonPage.content_en,
      ),
      event: formatClientEvent(event, locale),
      activeEvent: formatClientEvent(activeEvent, locale),
    },
  };
}
