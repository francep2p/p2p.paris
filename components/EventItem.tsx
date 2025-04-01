import { ClientEvent } from "@/types/client";
import { formatEventFullDate } from "@/utils/dates";
import Image from "next/image";
import Link from "next/link";

const formatNames = (names: string[]) => {
  if (!names.length) return "";
  return `${names.join(", ")}...`;
};

export const EventItem = (props: ClientEvent) => {
  const LINE_ITEMS = [
    {
      icon: "/icons/clock-outline.svg",
      value: formatEventFullDate(props.startDateTime, props.endDateTime),
    },
    {
      icon: "/icons/globe-outline.svg",
      value: props?.talks[0]?.language || "N/A",
    },
    {
      icon: "/icons/map-marker-outline.svg",
      value: props?.talks[0]?.location || "N/A",
    },
    {
      icon: "/icons/speaker-outline.svg",
      value: props.speakers?.length
        ? formatNames(props.speakers.map((speaker) => speaker.name))
        : "N/A",
    },
  ];

  return (
    <Link href={`/events/${props.slug}`} className="w-full">
      <div className="border border-[#282828] p-4 cursor-pointer">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[290px] gap-2">
          <div>
            {LINE_ITEMS.map((item) => (
              <div key={item.icon} className="flex gap-2 mb-3 items-center">
                <Image src={item.icon} alt="Icon" height={20} width={20} />
                <p className="uppercase text-[13px] text-gray-999 leading-5 tracking-[5%]">
                  {item.value}
                </p>
              </div>
            ))}
            <p
              className={`text-[13px] overflow-hidden text-ellipsis line-clamp-5 py-4`}
            >
              {props.description}
            </p>
          </div>
          {!!props.image && (
            <div className="flex justify-center items-center h-[290px]">
              <img
                className="w-full max-h-full object-contain"
                src={`/api/images/${props.image}`}
                alt={`${props.name} Banner`}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
