import { TALK_TYPE_TAG_MAPPER } from "@/components/Talk";
import { TalkItem } from "@/components/TalkItem";
import { BadgeType } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dropdown } from "@/components/ui/dropdown";
import { Tag } from "@/components/ui/tag";
import TextureSeparatorComponent from "@/components/ui/texture-separator";
import { ClientTalk } from "@/types/client";
import { formatDate } from "@/utils/dates";
import { groupTalksByDay } from "@/utils/helpers";
import { HomePage } from "@/utils/pageTypes";
import { $Enums } from "@prisma/client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const HomeSchedule = ({
  content,
  talks,
}: {
  content: HomePage;
  talks: ClientTalk[];
}) => {
  const groupedTalks = groupTalksByDay(talks);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedKinds, setSelectedKinds] = useState<string[]>([]);
  const activeTabData = groupedTalks[activeTabIndex];
  const uniqKinds = [...Object.values($Enums.TalkType)];

  const tabContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabContainerRef.current) {
      const activeTab = tabContainerRef.current.children[
        activeTabIndex
      ] as HTMLElement;
      if (activeTab) {
        const containerWidth = tabContainerRef.current.offsetWidth;
        const tabWidth = activeTab.offsetWidth;
        const scrollPosition =
          activeTab.offsetLeft - (containerWidth - tabWidth) / 2;
        tabContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [activeTabIndex]);

  return (
    <>
      <div className="w-full mt-20">
        <div className="flex gap-3">
          <Image src="/icons/calendar.svg" alt="Icon" height={24} width={24} />
          <h3 className="uppercase text-lg font-semibold my-6 z-10">
            {content.schedule.title}
          </h3>
        </div>
        <div ref={tabContainerRef} className="flex gap-3 overflow-x-auto">
          {groupedTalks.map((tab, index) => (
            <div
              key={tab.day}
              className={`h-[76px] border border-[#282828] flex  flex-none flex-col justify-between p-5 cursor-pointer ${
                activeTabIndex === index ? "border-white" : ""
              }`}
              onClick={() => setActiveTabIndex(index)}
            >
              <p className="uppercase text-[13px] leading-4 tracking-[5%] m-0 p-0">
                DAY {index + 1}
              </p>
              <p
                className={`uppercase text-[13px] text-gray-999 leading-4 tracking-[5%] m-0 p-0 ${
                  activeTabIndex === index ? "text-white" : ""
                }`}
              >
                {formatDate(tab.date)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Image src="/icons/filters.svg" alt="Icon" height={24} width={24} />
            <h3 className="uppercase text-lg font-semibold my-6 z-10">
              {content.schedule.filterTitle}
            </h3>
          </div>
          <div className="flex gap-6">
            <Dropdown
              Button={({ onClick, isOpen }) => (
                <Button
                  variant="outline"
                  className="uppercase gap-2 px-5"
                  onClick={onClick}
                >
                  {content.schedule.kind}
                  <Image
                    src="/icons/triangle-down.svg"
                    alt="Icon"
                    height={16}
                    width={16}
                    className={`transform transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                  {!!selectedKinds.length && (
                    <div className="h-4 w-4 rounded-full bg-white flex justify-center absolute -top-1 -right-1">
                      <span className="text-black text-xs">
                        {selectedKinds.length}
                      </span>
                    </div>
                  )}
                </Button>
              )}
              DropDownComponent={() => (
                <div className="absolute mt-2 z-10 border border-[#282828] bg-black p-3 flex flex-col gap-3 w-[180px] right-0">
                  {uniqKinds.map((kind) => (
                    <div key={kind} className="flex gap-2 items-center">
                      <Checkbox
                        isActive={selectedKinds.includes(kind)}
                        onChange={() =>
                          setSelectedKinds((prevKinds) => {
                            if (prevKinds.includes(kind)) {
                              return prevKinds.filter(
                                (existingKind) => existingKind !== kind,
                              );
                            } else {
                              return [...prevKinds, kind];
                            }
                          })
                        }
                      />
                      <Tag type={TALK_TYPE_TAG_MAPPER[kind]} className="" />
                    </div>
                  ))}
                </div>
              )}
            />
            {/* <Dropdown
              Button={({ onClick, isOpen }) => (
                <Button
                  variant="outline"
                  className="uppercase gap-2 px-5"
                  onClick={onClick}
                >
                  {content.schedule.location}
                  <Image
                    src="/icons/triangle-down.svg"
                    alt="Icon"
                    height={16}
                    width={16}
                    className={`transform transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </Button>
              )}
              DropDownComponent={() => <div></div>}
            /> */}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-3">
        <TextureSeparatorComponent className="flex items-center justify-center">
          <p className="text-lg uppercase">Day {activeTabIndex + 1}</p>
        </TextureSeparatorComponent>
        {activeTabData?.talks
          .filter((talk) =>
            selectedKinds?.length ? selectedKinds.includes(talk.type) : true,
          )
          .map((talk, index) => (
            <TalkItem
              key={talk.slug}
              {...talk}
              badgeType={index % 2 === 0 ? BadgeType.GREEN : BadgeType.YELLOW}
            />
          ))}
      </div>
    </>
  );
};
