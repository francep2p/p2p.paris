import { ClientEvent } from "@/types/client";
import { formatEventFullDate } from "@/utils/dates";
import { HomePage } from "@/utils/pageTypes";
import Image from "next/image";
import { HomeButtonsSection } from "./sections/home/buttons";

export const Event = ({
  content,
  event,
}: {
  content: HomePage;
  event: ClientEvent;
}) => {
  const containerStyles =
    "flex flex-col-reverse md:flex-row  items-center justify-between w-full mt-0 h-[508px] py-4 gap-3";

  return (
    <div className={containerStyles}>
      <div>
        <h2 className="text-base uppercase">{event.name}</h2>
        <p className="text-base uppercase max-w-[260px]">
          {formatEventFullDate(event.startDateTime, event.endDateTime)}
        </p>
        <p className="text-[13px] uppercase text-gray-999 my-3">
          {content.hero.nextMainEvent.descriptionTitle}
        </p>
        {event.slug === "festival-2" ? (
          <div className="bg-red-500 border-red-600  text-white text-center p-4 mb-4">
            <p className="text-base uppercase">
              THIS EVENT IS CANCELLED, SEE DISCORD ANNOUNCEMENT FOR FUTURE
              EVENTS.
            </p>
          </div>
        ) : (
          <></>
        )}
        {content.hero.nextMainEvent.descriptionItems.map((item) => (
          <p
            className="text-[13px] leading-[20px] tracking-[5%] text-gray-999 m-0 p-0"
            key={item}
          >
            {item}
          </p>
        ))}
        {new Date() < new Date(event.endDateTime) && (
          <HomeButtonsSection content={content} eventUrl={event.link} />
        )}
      </div>
      <Image
        src="/images/paris-p2p-logo.svg"
        width={200}
        height={200}
        alt="Paris P2P"
        className="my-6"
      />
    </div>
  );
};
