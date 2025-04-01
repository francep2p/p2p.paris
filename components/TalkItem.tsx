import { ClientTalk } from "@/types/client";
import { formatDate, formatTime } from "@/utils/dates";
import { getSpeakersString } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TALK_TYPE_TAG_MAPPER } from "./Talk";
import { BadgeType } from "./ui/badge";
import { Tag } from "./ui/tag";

export const TalkItem = (props: ClientTalk & { badgeType: BadgeType }) => {
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
      value: props.language,
    },
    {
      icon: "/icons/map-marker-outline.svg",
      value: props.location,
    },
    {
      icon: "/icons/speaker-outline.svg",
      value: getSpeakersString(props.speakers),
    },
  ];

  return (
    <Link href={`/talks/${props.slug}`}>
      <div className="w-full border border-[#282828] p-4">
        <div className="flex flex-col-reverse md:flex-col gap-6">
          <div className="flex justify-between flex-col md:flex-row md:items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex">
              {LINE_ITEMS.map((item, index) => (
                <React.Fragment key={item.icon}>
                  <div className="flex gap-2 mb-2 lg:mb-0 items-center">
                    <Image src={item.icon} alt="Icon" height={20} width={20} />
                    <p className="uppercase text-[13px] text-gray-999 leading-5 tracking-[5%]">
                      {item?.value?.toString?.()}
                    </p>
                  </div>
                  {index !== LINE_ITEMS.length - 1 && (
                    <div className="mx-4 w-[1px] h-4 bg-white opacity-20 hidden lg:block"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <Tag
              type={TALK_TYPE_TAG_MAPPER[props.type]}
              className="mt-4 lg:mt-0"
            />
          </div>
          <div>
            <p className="text-lg mb-1">{props.title}</p>
            <p
              className="text-[13px] text-gray-999 leading-4 py-4"
              dangerouslySetInnerHTML={{ __html: props.description }}
            ></p>
          </div>
        </div>
        {/* <div className="flex flex-row gap-1 mt-6">
        {props.badges.map((badge) => (
          <Badge key={badge} title={badge} type={props.badgeType} />
        ))}
      </div> */}
      </div>
    </Link>
  );
};
