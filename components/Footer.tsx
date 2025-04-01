import { generatePageTypeByLocale, Locale } from "@/utils/pageTypes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "./ui/button";
import { Logo } from "./ui/logo";

export const Footer = () => {
  let { locale } = useRouter();
  locale = locale === "catchAll" ? "fr" : locale;
  const content = generatePageTypeByLocale((locale || "en") as Locale).home;

  const SOCIAL_CONFIG = [
    {
      icon: "/icons/twitter-white.svg",
      title: "X (Twitter)",
      href: "https://x.com/ParisP2P",
    },
    {
      icon: "/icons/discord-white.svg",
      title: "Discord",
      href: "https://discord.com/invite/e4UZM4q",
    },
    {
      icon: "/icons/youtube-white.svg",
      title: "Youtube",
      href: "https://www.youtube.com/watch?v=LThccQYrhS8&list=PLNeNFYqVeWnNy8KdZOdOTlzSkKoBWyfqO",
    },
    {
      icon: "/icons/email-white.svg",
      title: "bootstrap@p2p.paris",
      href: "mailto:bootstrap@p2p.paris",
    },
  ];
  return (
    <footer className="w-full flex mt-20 mb-12 flex-col lg:flex-row">
      <div className="border border-[#282828] flex-1">
        <div className="p-3 border border-[#282828] flex items-center justify-between">
          <p className="text-lg uppercase font-semibold">
            {content.footer.buy.title}
          </p>
          <Link
            href="https://samourai.fun/products/paris-p2p-festival-t-shirt"
            target="__blank"
          >
            <Button variant="outline" className="uppercase">
              {content.footer.buy.buttonText}
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <Image
            src="/images/t-shirt.png"
            width={400}
            height={450}
            alt="T shirt"
          />
        </div>
      </div>
      <div className="border border-[#282828] flex-1">
        <div className="p-3 border border-[#282828] flex items-center justify-between">
          <Logo />
          <p className="uppercase text-gray-999 leading-4 text-[13px]">
            Paris p2p ©️ 2025
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {SOCIAL_CONFIG.map((item) => (
            <div
              key={item.title}
              className="h-[236px] border border-[#282828] p-3"
            >
              <Link
                href={item.href}
                target="__blank"
                className="flex items-center gap-2"
              >
                <Image
                  src={item.icon}
                  height={24}
                  width={24}
                  alt={`${item.title} Icon`}
                />
                <p className="text-[13px] leading-4">{item.title}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
