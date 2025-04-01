import { CommonTypes, Locale, SpeakerPage, TalkPage } from "@/utils/pageTypes";
import Head from "next/head";

import { ClientEvent, ClientSpeaker } from "@/types/client";
import Image from "next/image";
import Link from "next/link";

import { Page } from "@/components/Page";
import { Talk } from "@/components/Talk";
import { Button } from "@/components/ui/button";
import { NotFound } from "@/components/ui/not-found";
import TextureSeparatorComponent from "@/components/ui/texture-separator";
import { db } from "@/utils/back/db";
import { formatClientEvent, formatClientSpeaker } from "@/utils/helpers";
import { GetStaticPaths, GetStaticProps } from "next";
import { NextSeo } from "next-seo";

export default function Talks({
  content,
  speaker,
  activeEvent,
}: {
  content: { common: CommonTypes; speaker: SpeakerPage; talk: TalkPage };
  speaker: ClientSpeaker;
  activeEvent: ClientEvent;
}) {
  if (!speaker) {
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
          href="/speakers"
          className="mt-10 mb-5 flex w-full gap-3 items-center"
        >
          <Button className="mx-auto mb-10">
            <h2 className="uppercase font-bold">{content.speaker.showAll}</h2>
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
          <title>{speaker.name}</title>
        </Head>
      )}
      event={activeEvent}
      common={content.common}
    >
      <NextSeo
        title={`${speaker.name} - Paris P2P`}
        description={
          speaker.desc ||
          "Discover hundreds of talks on P2P, Cryptography, Privacy and more."
        }
        canonical={`https://paris.p2p/speakers/${speaker.slug}`}
      />
      <Link
        href="/speakers"
        className="mt-10 mb-5 flex w-full gap-3 items-center"
      >
        <Image
          src="/icons/chevron-left-white.svg"
          alt="Go back icon"
          height={40}
          width={40}
        />
        <h2 className="uppercase font-bold">{content.speaker.showAll}</h2>
      </Link>
      <div className="p-4 items-center flex flex-col">
        <img
          src={`/api/images/${speaker.image}`}
          height={160}
          width={160}
          className="bg-[#282828]"
          alt={`${speaker.name} avatar`}
        />
        <h2 className="text-lg font-semibold uppercase mt-4 mb-2">
          {speaker.name}
        </h2>
        <h2 className="text-lg uppercase mb-4">{speaker.desc}</h2>
        <div className="flex items-center justify-center gap-3">
          {!!speaker.social.twitter && (
            <a
              href={speaker.social?.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <Image
                src="/icons/twitter.svg"
                alt="Twitter logo"
                width={24}
                height={24}
              />
            </a>
          )}
          {!!speaker.social?.github && (
            <a
              href={speaker.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <Image
                src="/icons/github.svg"
                alt="Github logo"
                width={24}
                height={24}
              />
            </a>
          )}
        </div>
      </div>
      <TextureSeparatorComponent className="border-0 border-b-[1px] border-r-[1px]" />

      <div className=" mt-10 mb-5 flex w-full gap-3">
        <Image
          src="/icons/talk-white.svg"
          alt="Talk icon"
          height={24}
          width={24}
        />
        <h2 className="uppercase font-bold">{content.talk.title}</h2>
      </div>
      <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-4">
        {speaker.talks.map((talk) => (
          <Talk key={talk.slug} {...talk} />
        ))}
      </div>
    </Page>
  );
}
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const prisma = db;
  const speakers = await prisma.speaker.findMany({
    select: {
      slug: true,
    },
  });

  const paths = speakers.flatMap((speaker) =>
    locales!.map((locale) => ({
      params: { slug: speaker.slug },
      locale,
    })),
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const prisma = db;
  const { slug } = params as { slug: string };

  const speaker = await prisma.speaker.findUnique({
    where: {
      slug,
    },
    include: {
      talks: true,
    },
  });

  const commonContent = await prisma.page.findUnique({
    where: {
      slug: "common",
    },
  });

  const speakerContent = await prisma.page.findUnique({
    where: {
      slug: "speaker",
    },
  });

  const talkContent = await prisma.page.findUnique({
    where: {
      slug: "talk",
    },
  });
  const activeEvent = await prisma.event.findFirst({
    where: {
      active: true,
    },
  });

  if (
    !speaker ||
    !commonContent ||
    !speakerContent ||
    !talkContent ||
    !activeEvent
  ) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      content: {
        common: JSON.parse(
          locale === "en" ? commonContent.content_en : commonContent.content_fr,
        ),
        speaker: JSON.parse(
          locale === "en"
            ? speakerContent.content_en
            : speakerContent.content_fr,
        ),
        talk: JSON.parse(
          locale === "en" ? talkContent.content_en : talkContent.content_fr,
        ),
      },
      speaker:
        speaker && formatClientSpeaker(speaker, (locale as Locale) || "en"),
      activeEvent: formatClientEvent(activeEvent, locale as Locale),
    },
  };
};
