import React from "react";

interface TextureComponentProps {
  children?: React.ReactNode;
  className?: string;
}

const TextureSeparatorComponent: React.FC<TextureComponentProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`relative border border-[#282828] w-full h-20 bg-[repeating-linear-gradient(90deg,_#282828,_#282828_1px,_transparent_1px,_transparent_5px)]  ${className}`}
    >
      {!!children && children}
    </div>
  );
};

export default TextureSeparatorComponent;
