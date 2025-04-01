import { CommonTypes, EventPage, Locale } from "@/utils/pageTypes";
import Head from "next/head";

import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { ClientEvent } from "@/types/client";
import { formatClientEvent } from "@/utils/helpers";
import Image from "next/image";
import { useState } from "react";

import { EventItem } from "@/components/EventItem";
import { db } from "@/utils/back/db";
import { NextSeo } from "next-seo";

export default function Events({
  content,
  commonContent,
  events,
  activeEvent,
}: {
  content: EventPage;
  commonContent: CommonTypes;
  events: ClientEvent[];
  activeEvent: ClientEvent;
}) {
  const [visibleItemCount, setVisibleItemCount] = useState(30);

  const handleLoadMore = () => {
    setVisibleItemCount((prev) => prev + 30);
  };
  return (
    <Page
      meta={() => (
        <Head>
          <title>{content.title}</title>
        </Head>
      )}
      event={activeEvent}
      common={commonContent}
    >
      <NextSeo
        title="Events - Paris P2P"
        description="Discover parisian events focused on P2P, Cryptography, Privacy and more."
        canonical="https://paris.p2p/en/events"
      />
      <div className=" mt-10 mb-5 flex w-full gap-3">
        <Image
          src="/icons/talk-white.svg"
          alt="Talk icon"
          height={24}
          width={24}
        />
        <h1 className="uppercase font-bold">{content.title}</h1>
      </div>
      <div className="mb-4 gap-4 w-full flex flex-col">
        {events.slice(0, visibleItemCount).map((event) => (
          <EventItem key={event.slug} {...event} />
        ))}
      </div>
      <div className="mb-20">
        {visibleItemCount < events.length && (
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="uppercase"
          >
            {commonContent.loadMore}
          </Button>
        )}
      </div>
    </Page>
  );
}

export async function getStaticProps({ locale }: { locale: Locale }) {
  const prisma = db;
  const activeEvent = await prisma.event.findFirst({
    where: {
      active: true,
    },
  });

  const events = await prisma.event.findMany({
    orderBy: {
      start_date: "desc",
    },
    include: {
      talks: {
        take: 5,
        include: {
          speakers: {
            take: 5,
          },
        },
      },
    },
  });
  const page = await prisma.page.findUnique({
    where: {
      slug: "talk",
    },
  });
  const commonPage = await prisma.page.findUnique({
    where: {
      slug: "common",
    },
  });

  if (!page || !commonPage || !activeEvent) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      content: JSON.parse(locale === "fr" ? page.content_fr : page.content_en),
      commonContent: JSON.parse(
        locale === "fr" ? commonPage.content_fr : commonPage.content_en,
      ),
      events: events.map((t) => formatClientEvent(t, locale)),
      activeEvent: formatClientEvent(activeEvent, locale),
    },
  };
}
