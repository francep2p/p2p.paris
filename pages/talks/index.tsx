import { Talk } from "@/components/Talk";
import { CommonTypes, Locale, TalkPage } from "@/utils/pageTypes";
import Head from "next/head";

import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import { ClientEvent, ClientTalk } from "@/types/client";
import { db } from "@/utils/back/db";
import { formatClientEvent, formatClientTalk } from "@/utils/helpers";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useState } from "react";

export default function Talks({
  content,
  commonContent,
  talks,
  activeEvent,
}: {
  content: TalkPage;
  commonContent: CommonTypes;
  talks: ClientTalk[];
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
        title="Talks - Paris P2P"
        description="Discover hundreds of talks on P2P, Cryptography, Privacy and more."
        canonical="https://paris.p2p/en/talks"
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
      <div className="mb-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
        {talks.slice(0, visibleItemCount).map((talk) => (
          <Talk key={talk.slug} {...talk} />
        ))}
      </div>
      <div className="mb-20">
        {visibleItemCount < talks.length && (
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

  const talks = await prisma.talk.findMany({
    include: {
      event: {
        include: {
          location: true,
        },
      },
      speakers: true,
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
      talks: talks.map((t) => formatClientTalk(t, locale)),
      activeEvent: formatClientEvent(activeEvent, locale),
    },
  };
}
