import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/back/db";
import { CommonTypes } from "@/utils/pageTypes";
import { NextSeo } from "next-seo";
import Link from "next/link";

export default function Page({ common }: { common: CommonTypes }) {
  return (
    <div className="h-[100vh] flex flex-col justify-between">
      <NextSeo
        title="Paris P2P"
        description="Discover hundreds of talks on P2P, Cryptography, Privacy and more."
        canonical="https://paris.p2p/"
      />
      <div className="flex flex-col w-3/4 mx-auto gap-16 justify-between">
        <Header common={common} />
      </div>

      <div className="flex flex-col gap-8 mx-auto text-center">
        <h2 className="uppercase text-xl">No cool peers to find here :(</h2>
        <p className="">You got lost</p>
        <Link href="/">
          <Button>Go back home</Button>
        </Link>
      </div>

      <div></div>
      <div></div>
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  const common = await db.page.findUnique({
    where: {
      slug: "common",
    },
  });

  if (!common) {
    return {
      notFound: true,
    };
  }

  const localizedCommon =
    locale === "en" ? common.content_en : common.content_fr;

  return {
    props: {
      common: JSON.parse(localizedCommon),
    },
  };
}
