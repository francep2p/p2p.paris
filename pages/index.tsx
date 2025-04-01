import { Page } from "@/components/Page";
import { HomeButtonsSection } from "@/components/sections/home/buttons";
import { HomeCoOrg } from "@/components/sections/home/co-org";
import { HomeEventsSection } from "@/components/sections/home/events";
import { HomeSpeakers } from "@/components/sections/home/speakers";
import { ClientEvent } from "@/types/client";
import { CommonTypes, HomePage, Locale } from "@/utils/pageTypes";
import Head from "next/head";

import { HomeGathering } from "@/components/sections/home/gathering";
import { PreviousConferences } from "@/components/sections/home/previous-conferences";
import { db } from "@/utils/back/db";
import { formatClientEvent } from "@/utils/helpers";
const Separator = ({ className = "" }: { className?: string }) => (
  <div className={`border w-full border-[#282828] mt-10 ${className}`}></div>
);

export default function Home({
  activeEvent,
  content,
  commonContent,
  previousEvents,
}: {
  content: HomePage;
  commonContent: CommonTypes;
  activeEvent: ClientEvent;
  previousEvents: ClientEvent[];
}) {
  return (
    <Page
      meta={() => (
        <Head>
          <title>
            The Parisian community interested in all things P2P - Paris P2P
          </title>
        </Head>
      )}
      event={activeEvent}
      common={commonContent}
    >
      <HomeEventsSection content={content} event={activeEvent} />
      <HomeGathering
        content={content}
        eventLink={`/events/${activeEvent.slug}`}
      />
      <PreviousConferences content={content} events={previousEvents} />
      <HomeButtonsSection content={content} />
      <HomeCoOrg content={content} sponsors={activeEvent.sponsors} />
      <Separator />
      <HomeSpeakers
        content={content}
        speakers={activeEvent.speakers}
        commonContent={commonContent}
        isHomePage
      />
      <Separator />
    </Page>
  );
}

export async function getStaticProps({ locale }: { locale: Locale }) {
  const prisma = db;

  const activeEvent = await prisma.event.findFirst({
    where: {
      active: true,
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

  if (!activeEvent) {
    return {
      notFound: true,
    };
  }

  const previousEvents = await prisma.event.findMany({
    where: {
      active: false,
    },
    take: 3,
    orderBy: {
      start_date: "desc",
    },
  });

  if (activeEvent && !activeEvent?.sponsors.length) {
    activeEvent.sponsors = await prisma.organization.findMany({
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

  if (!page || !commonPage) {
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
      activeEvent: formatClientEvent(activeEvent, locale),
      previousEvents: previousEvents.map((e) => formatClientEvent(e, locale)),
    },
  };
}
