import { Button } from "@/components/ui/button";
import TextureSeparatorComponent from "@/components/ui/texture-separator";
import { HomePage } from "@/utils/pageTypes";
import Image from "next/image";
import { useState } from "react";

export const HomeInformation = ({ content }: { content: HomePage }) => {
  const [inputValue, setInputValue] = useState("");
  const data = [
    {
      title: content.usefulInformation.groundControl.title,
      description: content.usefulInformation.groundControl.desc,
      buttonText: content.usefulInformation.groundControl.buttonText,
      icon: "/icons/ground-control.svg",
    },
    {
      title: content.usefulInformation.support.title,
      description: content.usefulInformation.support.desc,
      buttonText: content.usefulInformation.support.buttonText,
      icon: "/icons/support.svg",
    },
    {
      title: content.usefulInformation.news.title,
      description: content.usefulInformation.news.desc,
      buttonText: content.usefulInformation.news.buttonText,
      icon: "/icons/news.svg",
      inputPlaceholder: content.usefulInformation.news.inputPlaceholder,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex gap-3">
        <Image src="/icons/info.svg" alt="Icon" height={24} width={24} />
        <h3 className="uppercase text-lg font-semibold my-6 z-10">
          {content.usefulInformation.title}
        </h3>
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-[#282828]">
          {data.map((item) => (
            <div
              key={item.title}
              className="min-h-[200px] border border-[#282828] flex flex-col justify-between p-4"
            >
              <Image
                src={item.icon}
                alt={`${item.title} Icon`}
                width={24}
                height={24}
              />
              <h3 className="uppercase text-lg font-semibold py-4">
                {item.title}
              </h3>
              <div>
                <p className="uppercase text-[13px] text-gray-999 leading-[20px] tracking-[5%]  m-0 p-0">
                  {item.description}
                </p>
              </div>
              <form
                className="mt-4 gap-4 flex"
                onSubmit={(e) => e.preventDefault()}
              >
                {!!item.inputPlaceholder && (
                  <input
                    className="border border-[#282828] h-10 w-full p-3 uppercase"
                    placeholder={item.inputPlaceholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                )}
                <Button variant="outline" type="submit">
                  {item.buttonText}
                </Button>
              </form>
            </div>
          ))}
        </div>
      </div>
      <TextureSeparatorComponent />
    </div>
  );
};
