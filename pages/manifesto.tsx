import { Page } from "@/components/Page";
import { ClientEvent } from "@/types/client";
import { db } from "@/utils/back/db";
import { formatClientEvent } from "@/utils/helpers";
import { CommonTypes, Locale, ManifestoPage } from "@/utils/pageTypes";
import { NextSeo } from "next-seo";
import Head from "next/head";

export default function Manifesto({
  content,
  activeEvent,
  common,
}: {
  content: ManifestoPage;
  activeEvent: ClientEvent;
  common: CommonTypes;
}) {
  return (
    <Page
      meta={() => (
        <Head>
          <title>{content.title}</title>
        </Head>
      )}
      event={activeEvent}
      common={common}
    >
      <NextSeo
        title="Manifest - Paris P2P"
        description="Paris P2P manifesto. Open source is rebellion. Peer-to-peer is survival."
        canonical="https://paris.p2p/en/manifesto"
      />
      <div className=" mt-10 mb-5 flex w-full gap-4">
        <h1 className="uppercase font-bold">{content.title}_</h1>
        <div className="h-6 w-full bg-[#282828]" />
      </div>
      <div className="mb-[200px]">
        {content.content.map((contentItem) => (
          <>
            {contentItem.text.map((item) => (
              <div
                key={item}
                className="uppercase leading-[40px] tracking-wider"
              >
                {contentItem.type === "title" ? (
                  <h2 key={item} className="">
                    {item}
                  </h2>
                ) : (
                  <p key={item} className="text-gray-999">
                    {item}
                  </p>
                )}
              </div>
            ))}
          </>
        ))}
      </div>
    </Page>
  );
}

export async function getStaticProps({ locale }: { locale: Locale }) {
  const prisma = db;
  const page = await prisma.page.findUnique({
    where: {
      slug: "manifesto",
    },
  });

  const common = await prisma.page.findUnique({
    where: {
      slug: "common",
    },
  });

  const activeEvent = await prisma.event.findFirst({
    where: {
      active: true,
    },
  });

  if (!page || !activeEvent || !common) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      content: JSON.parse(locale === "fr" ? page.content_fr : page.content_en),
      activeEvent: formatClientEvent(activeEvent, locale),
      common: JSON.parse(
        locale === "fr" ? common.content_fr : common.content_en,
      ),
    },
  };
}
