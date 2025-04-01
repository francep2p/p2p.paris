import Image from "next/image";

export enum TagType {
  DJ_SET,
  HACKATHON,
  MEET_UP,
  PROJECTION,
  STAND,
  TALK,
  WORKSHOP,
}

interface IconDetails {
  color: string;
  icon: string;
  title: string;
}

const ICON_LIST: Record<TagType, IconDetails> = {
  [TagType.DJ_SET]: {
    color: "#B062FF",
    icon: "/icons/dj-set.svg",
    title: "DJ SET",
  },
  [TagType.HACKATHON]: {
    color: "#FFCD62",
    icon: "/icons/hackathon.svg",
    title: "HACKATHON",
  },
  [TagType.MEET_UP]: {
    color: "#5A7DFF",
    icon: "/icons/meet-up.svg",
    title: "MEET UP",
  },
  [TagType.PROJECTION]: {
    color: "#96FB58",
    icon: "/icons/projection.svg",
    title: "PROJECTION",
  },
  [TagType.STAND]: {
    color: "#FF62DF",
    icon: "/icons/stand.svg",
    title: "STAND",
  },
  [TagType.TALK]: {
    color: "#3BEECD",
    icon: "/icons/talk.svg",
    title: "TALK",
  },
  [TagType.WORKSHOP]: {
    color: "#FF3F5C",
    icon: "/icons/workshop.svg",
    title: "WORKSHOP",
  },
};

interface TagProps {
  type: TagType;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ type, className = "" }: TagProps) => {
  const { color, icon, title } = ICON_LIST[type];
  return (
    <div
      className={`inline-flex px-2 py-1.5 gap-2 border items-center flex-shrink-0 ${className}`}
      style={{ borderColor: color }}
    >
      <Image src={icon} alt={`${title} icon`} height={20} width={20} />
      <span
        className="uppercase text-[13px] text-gray-999 leading-4 tracking-[5%] whitespace-nowrap"
        style={{ color }}
      >
        {title}
      </span>
    </div>
  );
};
