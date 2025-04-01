import { Button } from "@/components/ui/button";
import { HomePage } from "@/utils/pageTypes";
import Link from "next/link";

export const HomeButtonsSection = ({
  content,
  eventUrl,
  hackathonUrl,
}: {
  content: HomePage;
  eventUrl?: string;
  hackathonUrl?: string;
}) => {
  const buttons = [
    {
      title: content.buttons.getTicket.title,
      href: eventUrl || "https://www.meetup.com/France-P2P/events/",
    },
    {
      title: content.buttons.joinHackathon.title,
      href:
        hackathonUrl ||
        "https://airtable.com/appVBIJFBUheVWS0Q/shrGTsouY2ITUcQwY",
    },
  ];

  return (
    <div className="w-full my-10 flex flex-col items-center sm:flex-row gap-6 sm:justify-center">
      {buttons.map((button, index) => (
        <Link href={button.href} key={index} target="__blank">
          <Button
            variant="outline"
            className="w-[212px] justify-between uppercase text-[13px]"
          >
            {button.title} <span>&gt;</span>
          </Button>
        </Link>
      ))}
    </div>
  );
};
