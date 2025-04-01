export enum BadgeType {
  GREEN,
  YELLOW,
}

interface ColorDetails {
  text: string;
  bg: string;
}

const COLOR_LIST: Record<BadgeType, ColorDetails> = {
  [BadgeType.GREEN]: {
    text: "#3BEECD",
    bg: "rgba(59, 238, 205, 0.12)",
  },
  [BadgeType.YELLOW]: {
    text: "#FFAE38",
    bg: "rgba(255, 174, 56, 0.12)",
  },
};

interface BadgeProps {
  type: BadgeType;
  title: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, title }: BadgeProps) => {
  const { text, bg } = COLOR_LIST[type];
  return (
    <div
      className="flex px-2.5 py-1.5 items-center justify-center flex-shrink-0"
      style={{ backgroundColor: bg }}
    >
      <span
        className="uppercase text-[13px] text-gray-999 leading-4 tracking-[5%] whitespace-nowrap"
        style={{ color: text }}
      >
        {title}
      </span>
    </div>
  );
};
