import { ClientSpeaker } from "@/types/client";
import Image from "next/image";
import Link from "next/link";

interface SpeakerProps extends ClientSpeaker {
  className?: string;
}

export const Speaker = (props: SpeakerProps) => {
  return (
    <div
      className={`h-[412px] w-full border border-[#282828] flex flex-col ${props.className || ""}`}
    >
      <Link
        href={`/speakers/${props.slug}`}
        className="m-2 h-[320px] overflow-hidden bg-[#282828]"
      >
        {!!props.image && (
          <img
            src={`/api/images/${props.image}`}
            className="object-contain w-full h-full"
            alt={props.name}
          />
        )}
      </Link>
      <div className="border-t border-[#282828] flex justify-between items-end p-5">
        <div>
          <Link
            href={`/speakers/${props.slug}`}
            className="text-[13px] leading-4 tracking-[5%]"
          >
            {props.name}
          </Link>
          <p className="text-[13px] leading-4 tracking-[5%] text-gray-999 mt-1 text-ellipsis line-clamp-1 text-wrap">
            {props.desc}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 flex-shrink-0">
          {!!props.social.twitter && (
            <a
              href={props.social?.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <Image
                src="/icons/twitter.svg"
                alt="Twitter logo"
                width={24}
                height={24}
              />
            </a>
          )}
          {!!props.social?.github && (
            <a
              href={props.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80"
            >
              <Image
                src="/icons/github.svg"
                alt="Github logo"
                width={24}
                height={24}
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
