import TextureSeparatorComponent from "@/components/ui/texture-separator";
import { formatEventFullDate } from "@/utils/dates";
import dayjs from "dayjs";

interface HomeEventsHighlightsProps {
  totalEvents: number;
  totalSpeakers: number;
  totalLocation: number;
  startDateTime: string;
  endDateTime: string;
  location: string;
}
export const HomeEventsHighlights = (props: HomeEventsHighlightsProps) => {
  const data = [
    {
      title: `${dayjs(props.endDateTime).diff(props.startDateTime, "day") + 1} days`,
      description: [
        formatEventFullDate(props.startDateTime, props.endDateTime),
      ],
    },
    {
      title: `${props.totalEvents} events`,
      description: [
        "/conferences",
        "/workshops",
        "/hackathon",
        "/free co-working",
      ],
    },
    {
      title: `${props.totalSpeakers} speakers`,
      description: ["From everywhere to talk about the internet of tomorrow"],
    },
    {
      title: `${props.totalLocation} location`,
      description: [props.location],
    },
  ];

  return (
    <div className="w-full">
      <h3 className="uppercase text-lg font-semibold my-6">Title</h3>
      <div className="flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 border border-[#282828]">
          {data.map((item) => (
            <div
              key={item.title}
              className="min-h-[200px] border border-[#282828] flex flex-col justify-between p-4"
            >
              <h3 className="uppercase text-lg font-semibold">{item.title}</h3>
              <div>
                {item.description.map((desc) => (
                  <p
                    key={desc}
                    className="uppercase text-[13px] text-gray-999 leading-[20px] tracking-[5%]  m-0 p-0"
                  >
                    {desc}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <TextureSeparatorComponent />
    </div>
  );
};
