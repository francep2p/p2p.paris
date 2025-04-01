import { Talk } from "@/components/Talk";
import { CommonTypes, HomePage, Locale, TalkPage } from "@/utils/pageTypes";
import Head from "next/head";

import { ClientEvent, ClientTalk } from "@/types/client";
import Image from "next/image";
import Link from "next/link";

import { Page } from "@/components/Page";
import { HomeSpeakers } from "@/components/sections/home/speakers";
import { Button } from "@/components/ui/button";
import { NotFound } from "@/components/ui/not-found";
import TextureSeparatorComponent from "@/components/ui/texture-separator";
import { db } from "@/utils/back/db";
import { formatClientEvent, formatClientTalk } from "@/utils/helpers";
import { NextSeo } from "next-seo";

export default function Talks({
  content,
  talk,
  activeEvent,
}: {
  content: { common: CommonTypes; talk: TalkPage; home: HomePage };
  talk: ClientTalk;
  activeEvent: ClientEvent;
}) {
  if (!talk) {
    return (
      <Page
        meta={() => (
          <Head>
            <title>{content.common.notFound}</title>
          </Head>
        )}
        event={activeEvent}
        common={content.common}
      >
        <NotFound />
        <Link
          href="/talks"
          className="mt-10 mb-5 flex w-full gap-3 items-center"
        >
          <Button className="mx-auto mb-10">
            <h2 className="uppercase font-bold">{content.talk.showAll}</h2>
          </Button>
        </Link>
        <TextureSeparatorComponent className="border-0 border-b-[1px] border-r-[1px]" />
      </Page>
    );
  }
  return (
    <Page
      meta={() => (
        <Head>
          <title>{talk.title}</title>
        </Head>
      )}
      event={activeEvent}
      common={content.common}
    >
      <NextSeo
        title={`${talk.title} - Paris P2P`}
        description={
          talk.description ||
          "Discover hundreds of talks on P2P, Cryptography, Privacy and more."
        }
        canonical={`https://paris.p2p/talks/${talk.slug}`}
      />
      <Link href="/talks" className="mt-10 mb-5 flex w-full gap-3 items-center">
        <Image
          src="/icons/chevron-left-white.svg"
          alt="Go back icon"
          height={40}
          width={40}
        />
        <h2 className="uppercase font-bold">{content.talk.showAll}</h2>
      </Link>
      <Talk {...talk} speakers={talk.speakers} isSingleView />
      <TextureSeparatorComponent className="border-0 border-b-[1px] border-r-[1px]" />
      {!!talk?.speakers?.length && (
        <HomeSpeakers
          content={content.home}
          speakers={talk.speakers}
          commonContent={content.common}
        />
      )}
    </Page>
  );
}

export async function getStaticPaths() {
  const prisma = db;
  const talks = await prisma.talk.findMany({
    select: {
      slug: true,
    },
  });

  const paths = talks.flatMap((talk) => [
    { params: { slug: talk.slug }, locale: "en" },
    { params: { slug: talk.slug }, locale: "fr" },
  ]);

  return {
    paths,
    fallback: "blocking",
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
  const talk = await prisma.talk.findUnique({
    where: {
      slug,
    },
    include: {
      event: {
        include: {
          location: true,
        },
      },
      speakers: true,
    },
  });

  const homePage = await prisma.page.findUnique({
    where: {
      slug: "home",
    },
  });

  const talkPage = await prisma.page.findUnique({
    where: {
      slug: "talk",
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

  if (!talk || !homePage || !talkPage || !commonPage || !activeEvent) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      content: {
        common: JSON.parse(
          locale === "en" ? commonPage.content_en : commonPage.content_fr,
        ),
        home: JSON.parse(
          locale === "en" ? homePage.content_en : homePage.content_fr,
        ),
        talk: JSON.parse(
          locale === "en" ? talkPage.content_en : talkPage.content_fr,
        ),
      },
      talk: talk && formatClientTalk(talk, locale),
      activeEvent: formatClientEvent(activeEvent, locale),
    },
  };
}
