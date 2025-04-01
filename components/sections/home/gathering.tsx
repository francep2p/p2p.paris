import TextureSeparatorComponent from "@/components/ui/texture-separator";
import { HomePage } from "@/utils/pageTypes";
import Image from "next/image";
import Link from "next/link";

export const HomeGathering = ({
  content,
  eventLink,
}: {
  content: HomePage;
  eventLink: string;
}) => {
  const data = [
    {
      title: content.gathering.programFestival,
      image: "/images/program-festival.png",
      href: eventLink,
    },
    {
      title: content.gathering.hackathon,
      image: "/images/hackathon-2025.png",
      href: "https://airtable.com/appVBIJFBUheVWS0Q/shrGTsouY2ITUcQwY",
      target: "__blank",
    },
    {
      title: content.gathering.speakers,
      image: "/images/speakers.png",
      href: "/speakers",
    },
  ];

  return (
    <div className="w-full">
      <h3 className="uppercase text-lg font-semibold my-6 z-10">
        {content.gathering.title}_
      </h3>

      <div className="flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-[#282828]">
          {data.map((item) => (
            <Link
              href={item.href}
              key={item.title}
              className="min-h-[200px] border border-[#282828] flex flex-col justify-between p-2 relative"
              target={item.target}
            >
              <img
                src={item.image}
                alt={`${item.title} image`}
                className="w-full object-contain"
              />
              <div className="flex gap-2 absolute top-3 left-4">
                <h3 className="uppercase font-semibold underline">
                  {item.title}
                </h3>
                <Image
                  src="/icons/arrow-right-white.svg"
                  height={24}
                  width={24}
                  alt="Arrow right icon"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <TextureSeparatorComponent />
    </div>
  );
};
