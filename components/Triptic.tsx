import Image from "next/image";

export const Triptic = ({ children }: { children: React.Component[] }) => (
  <div className="flex flex-col">
    <div className="flex flex-row-reverse">
      <Image
        className=""
        width={624}
        height={80}
        src="/images/texture-small.svg"
        alt={""}
      />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 border border-[#282828]">
      {/* @ts-ignore */}
      {children.map((c: any, i: number) => (
        <div
          key={`triptic-child-${i}`}
          className="border border-[#282828] flex p-6"
        >
          {c}
        </div>
      ))}
    </div>
    <Image
      className="scale-x-[-1]"
      width={624}
      height={80}
      src="/images/texture-small.svg"
      alt={""}
    />
  </div>
);
