import TextureSeparatorComponent from "@/components/ui/texture-separator";
import { HomePage } from "@/utils/pageTypes";
import Image from "next/image";

export const HomePlan = ({ content }: { content: HomePage }) => {
  return (
    <>
      <div className="w-full mt-2">
        <div className="flex gap-3">
          <Image src="/icons/plan.svg" alt="Icon" height={24} width={24} />
          <h3 className="uppercase text-lg font-semibold my-6 z-10">
            {content.plan.title}
          </h3>
        </div>

        <div className="w-full border border-[#282828] flex flex-col">
          <img
            src="/images/plan.png"
            alt="Floor plan"
            className="w-full h-auto"
          />
        </div>
      </div>
      <TextureSeparatorComponent />
    </>
  );
};
