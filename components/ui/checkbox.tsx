import Image from "next/image";

export const Checkbox = ({
  isActive,
  onChange,
}: {
  isActive: boolean;
  onChange?: (isActive: boolean) => void;
}) => {
  return (
    <div
      className={`h-5 w-5 border cursor-pointer flex justify-center  ${isActive ? "border-white" : "border-[#282828]"} `}
      onClick={() => onChange?.(!isActive)}
    >
      {isActive && (
        <Image
          src={"/icons/check-white.svg"}
          height={7}
          width={10}
          alt="Checkbox check icon"
        />
      )}
    </div>
  );
};
