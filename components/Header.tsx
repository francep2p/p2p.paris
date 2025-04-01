import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ClientEvent } from "@/types/client";
import { downloadCalendarICS } from "@/utils/helpers";
import { CommonTypes, Locale } from "@/utils/pageTypes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dropdown } from "./ui/dropdown";
import { Logo } from "./ui/logo";

interface ListItemProps extends PropsWithChildren {
  title: string;
  href: string;
  className?: string;
}

const ListItem = ({ className, title, children, href }: ListItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          href={href}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
ListItem.displayName = "ListItem";

export default function Header({
  event,
  common,
}: {
  event?: ClientEvent;
  common: CommonTypes;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { locale } = router;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle("overflow-hidden", !isMenuOpen);
  };
  const changeLocale = (newLocale: Locale) => {
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  useEffect(() => {
    const handleRouteChange = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
        document.body.classList.remove("overflow-hidden");
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events, isMenuOpen]);

  return (
    <div className="flex justify-between sticky top-0 h-20 items-center bg-black z-50 w-full">
      <Link href="/">
        <Logo />
      </Link>
      <NavigationMenu className="hidden lg:flex w-full bg mx-auto">
        <NavigationMenuList className="flex gap-20">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="uppercase">
              {common.header.events}_
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href={`/events/${event?.slug}`}
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        {event?.name}
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground text-ellipsis line-clamp-3">
                        {event?.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/events" title={common.header.pastEvents.title}>
                  {common.header.pastEvents.desc}
                </ListItem>
                <ListItem href="/speakers" title={common.header.speakers.title}>
                  {common.header.speakers.desc}
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/manifesto" legacyBehavior passHref>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle() + " uppercase"}
              >
                {common.header.manifesto}_
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-4 ml-auto mr-4">
        <div className="hidden lg:flex items-center justify-center gap-4 p-4">
          <a
            href="https://x.com/ParisP2P"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80"
          >
            <Image
              src="/icons/twitter.svg"
              alt="Twitter logo"
              width={20}
              height={20}
            />
          </a>
          <a
            href="https://discord.com/invite/e4UZM4q"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80"
          >
            <Image
              src="/icons/discord.svg"
              alt="Twitter logo"
              width={20}
              height={20}
            />
          </a>
        </div>
        <Button
          className="uppercase hidden lg:block"
          variant="outline"
          onClick={() => event && downloadCalendarICS(event)}
        >
          {common.header.addToCalendar}
        </Button>
      </div>

      <div className="flex gap-4">
        <Dropdown
          Button={({ onClick, isOpen }) => (
            <Button
              variant="outline"
              className="uppercase gap-2 px-5"
              onClick={onClick}
            >
              {locale}
              <Image
                src="/icons/triangle-down.svg"
                alt="Icon"
                height={16}
                width={16}
                className={`transform transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </Button>
          )}
          DropDownComponent={({ toggle }) => (
            <div className="absolute mt-2 z-50 border border-[#282828] bg-black p-3 flex flex-col gap-3 right-0 w-full">
              {["en", "fr"].map((locale) => (
                <div
                  key={locale}
                  className="flex gap-2 items-center uppercase cursor-pointer"
                  onClick={() => {
                    changeLocale(locale as Locale);
                    toggle?.();
                  }}
                >
                  {locale}
                </div>
              ))}
            </div>
          )}
        />
        <button
          onClick={toggleMenu}
          className="lg:hidden text-gray-600 hover:text-gray-900"
          aria-label="Toggle Menu"
        >
          <Image
            src={isMenuOpen ? "/icons/x-white.svg" : "/icons/bars-solid.svg"}
            height={10}
            width={16}
            alt="Menu icon"
          />
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden fixed mt-20 inset-0 z-50 bg-black h-full flex flex-col items-center">
          <div className="flex flex-col gap-4 overflow-y-auto justify-center p-4 w-11/12 h-[calc(100vh-80px)]">
            <Link
              className="flex select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
              href={`/events/${event?.slug}`}
            >
              <div className="mb-2 mt-4 text-lg font-medium">{event?.name}</div>
              <p className="text-sm leading-tight text-muted-foreground text-ellipsis line-clamp-2">
                {event?.description}
              </p>
            </Link>

            <Link
              href="/events"
              className="rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
            >
              <p>{common.header.pastEvents.title}</p>
              <p>{common.header.pastEvents.desc}</p>
            </Link>
            <Link
              href="/speakers"
              className="rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
            >
              <p>{common.header.speakers.title}</p>
              <p>{common.header.speakers.desc}</p>
            </Link>
            <Link href="/manifesto" legacyBehavior passHref>
              <div className="uppercase underline text-center">
                {common.header.manifesto}_
              </div>
            </Link>
            <div className="flex items-center justify-center gap-4 mt-auto">
              <a
                href="https://x.com/ParisP2P"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
              >
                <Image
                  src="/icons/twitter.svg"
                  alt="Twitter logo"
                  width={30}
                  height={30}
                />
              </a>
              <a
                href="https://discord.com/invite/e4UZM4q"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
              >
                <Image
                  src="/icons/discord.svg"
                  alt="Discord logo"
                  width={30}
                  height={30}
                />
              </a>
            </div>
            <Button className="uppercase w-full" variant="outline">
              {common.header.addToCalendar}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
