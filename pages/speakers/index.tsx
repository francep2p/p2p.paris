import { CommonTypes, Locale, SpeakerPage } from "@/utils/pageTypes";
import Head from "next/head";

import { Page } from "@/components/Page";
import { Speaker } from "@/components/Speaker";
import { Button } from "@/components/ui/button";
import { ClientEvent, ClientSpeaker } from "@/types/client";
import { db } from "@/utils/back/db";
import { formatClientEvent, formatClientSpeaker } from "@/utils/helpers";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Speakers({
  content,
  speakers,
  commonContent,
  activeEvent,
}: {
  content: SpeakerPage;
  speakers: ClientSpeaker[];
  commonContent: CommonTypes;
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
        title="Speakers - Paris P2P"
        description="Discover hundreds of speakers discussing P2P, Cryptography, Privacy and more."
        canonical="https://paris.p2p/en/speakers"
      />
      <div className="flex justify-between items-center mt-10 mb-5 w-full">
        <div className="flex gap-3 items-center">
          <Image
            src="/icons/mic.svg"
            alt="Speaker icon"
            height={24}
            width={24}
          />
          <h1 className="uppercase font-bold">{content.title}_</h1>
        </div>
        <Link
          href="https://airtable.com/appVBIJFBUheVWS0Q/shrQl65lAr3zl5pkW"
          target="__blank"
        >
          <Button variant="outline" className="uppercase">
            {content.becomeSpeaker}
          </Button>
        </Link>
      </div>

      <div className="mb-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {speakers.slice(0, visibleItemCount).map((speaker) => (
          <Speaker key={speaker.slug} {...speaker} />
        ))}
      </div>
      <div className="mb-20">
        {visibleItemCount < speakers.length && (
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
  const speakers = await prisma.speaker.findMany({
    include: {
      talks: true,
    },
  });
  const page = await prisma.page.findUnique({
    where: {
      slug: "speaker",
    },
  });
  const commonPage = await prisma.page.findUnique({
    where: {
      slug: "common",
    },
  });
  const activeEvent = await prisma.event.findFirst({
    where: {
      active: true,
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
      speakers: speakers.map((t) => formatClientSpeaker(t, locale)),
      activeEvent: formatClientEvent(activeEvent, locale),
    },
  };
}
