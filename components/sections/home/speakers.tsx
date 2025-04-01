import { Speaker } from "@/components/Speaker";
import { Button } from "@/components/ui/button";
import { ClientSpeaker } from "@/types/client";

import { CommonTypes, HomePage } from "@/utils/pageTypes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export const HomeSpeakers = ({
  content,
  commonContent,
  speakers,
  isHomePage,
}: {
  content: HomePage;
  commonContent: CommonTypes;
  speakers: ClientSpeaker[];
  isHomePage?: boolean;
}) => {
  const [visibleItemCount, setVisibleItemCount] = useState(30);
  const router = useRouter();

  const handleLoadMore = () => {
    if (isHomePage) {
      router.push("/speakers");
    } else {
      setVisibleItemCount((prev) => prev + 30);
    }
  };

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <Image src="/icons/mic.svg" alt="Icon" height={24} width={24} />
          <h3 className="uppercase text-lg font-semibold my-6 z-10">
            {content.speakers.title}
          </h3>
        </div>
        <Link
          href="https://airtable.com/appVBIJFBUheVWS0Q/shrQl65lAr3zl5pkW"
          target="__blank"
        >
          <Button variant="outline" className="uppercase">
            {content.speakers.buttonText}
          </Button>
        </Link>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 border border-[#282828]">
          {speakers.slice(0, visibleItemCount).map((item) => (
            <Speaker key={item.slug} {...item} />
          ))}
        </div>
      </div>
      <div className="my-2 w-full flex justify-center">
        {visibleItemCount < speakers.length && (
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="uppercase"
          >
            {isHomePage ? commonContent.showAll : commonContent.loadMore}
          </Button>
        )}
      </div>
    </div>
  );
};
