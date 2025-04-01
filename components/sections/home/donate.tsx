import { Button } from "@/components/ui/button";
import TextureSeparatorComponent from "@/components/ui/texture-separator";
import { HomePage } from "@/utils/pageTypes";
import Image from "next/image";

export const HomeDonate = ({ content }: { content: HomePage }) => {
  return (
    <>
      <div className="w-full min-h-[200px] relative flex flex-col justify-between p-4">
        <h3 className="uppercase text-lg font-semibold my-6 z-10">
          {content.donate.title}
        </h3>
        <div className="flex flex-col  md:flex-row justify-between gap-6 md:gap-20">
          <p className="uppercase text-[13px] text-gray-999">
            {content.donate.description}
          </p>
          <Button className="w-[130px] uppercase">
            {content.donate.buttonText}
          </Button>
        </div>
        <Image
          src="/icons/heart.svg"
          height={80}
          width={80}
          alt="Heart"
          className="absolute top-4 right-4"
        />
      </div>
      <TextureSeparatorComponent />
    </>
  );
};
