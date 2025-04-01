import Image from "next/image";

export const Logo = () => {
  return (
    <div className="flex gap-4 items-center">
      <Image
        width={30}
        height={30}
        alt="Paris P2P"
        src="/images/paris-p2p-logo.svg"
      />
      <h2 className="font-bold text-lg hidden sm:block">Paris P2P</h2>
    </div>
  );
};
