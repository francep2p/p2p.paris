import { ClientTalk } from "@/types/client";
import { formatDate, formatTime } from "@/utils/dates";
import { $Enums } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Tag, TagType } from "./ui/tag";

export const TALK_TYPE_TAG_MAPPER: Record<$Enums.TalkType, TagType> = {
  HACKATHON: TagType.HACKATHON,
  MEET_UP: TagType.MEET_UP,
  PROJECTION: TagType.PROJECTION,
  STAND: TagType.STAND,
  TALK: TagType.TALK,
  WORKSHOP: TagType.WORKSHOP,
  PARTY: TagType.DJ_SET,
};

const formatNames = (names: string[]) => {
  if (!names.length) return "";

  if (names.length === 1) return names[0];

  const allExceptLast = names.slice(0, -1).join(", ");
  const last = names[names.length - 1];

  return `${allExceptLast} & ${last}`;
};

export const Talk = (props: ClientTalk & { isSingleView?: boolean }) => {
  const LINE_ITEMS = [
    {
      icon: "/icons/calendar-outline.svg",
      value: formatDate(props.startDateTime),
    },
    {
      icon: "/icons/clock-outline.svg",
      value: `${formatTime(props.startDateTime)} - ${formatTime(props.endDateTime)}`,
    },
    {
      icon: "/icons/globe-outline.svg",
      value: props.language || "N/A",
    },
    {
      icon: "/icons/map-marker-outline.svg",
      value: props.location || "N/A",
    },
    {
      icon: "/icons/speaker-outline.svg",
      value: props.speakers?.length
        ? formatNames(props.speakers.map((speaker) => speaker.name))
        : "N/A",
    },
  ];

  return (
    <Link href={`/talks/${props.slug}`} className="w-full">
      <div className="border border-[#282828] p-4 cursor-pointer">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[290px]">
          <div>
            <Tag type={TALK_TYPE_TAG_MAPPER[props.type]} className="mb-4" />
            {LINE_ITEMS.map((item) => (
              <div key={item.icon} className="flex gap-2 mb-3 items-center">
                <Image src={item.icon} alt="Icon" height={20} width={20} />
                <p className="uppercase text-[13px] text-gray-999 leading-5 tracking-[5%]">
                  {item.value}
                </p>
              </div>
            ))}
            {props.videoUrl?.length ? (
              <div
                key="/icons/youtube-white.svg"
                className="flex gap-2 mb-3 items-center"
              >
                <Image
                  src="/icons/youtube-white.svg"
                  alt="Icon"
                  height={20}
                  width={20}
                />

                <p className="text-[13px] text-gray-999 leading-5 tracking-[5%]">
                  {props.videoUrl}
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
          {!!props.image && (
            <div className="flex justify-center items-center h-[290px]">
              <img
                className="w-full object-contain max-h-full"
                src={`/api/images/${props.image}`}
                alt={`${props.title} Banner`}
              />
            </div>
          )}
        </div>

        <div className="h-[192px]">
          <h2 className="text-lg font-semibold text-primary">{props.title}</h2>
          <p
            className={`text-[13px] overflow-hidden ${props.isSingleView ? "" : "text-ellipsis line-clamp-5"} py-4`}
            dangerouslySetInnerHTML={{ __html: props.description }}
          />
        </div>
      </div>
    </Link>
  );
};
