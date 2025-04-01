import { generatePageTypeByLocale, Locale } from "@/utils/pageTypes";
import { useRouter } from "next/router";
import React from "react";

export const NotFound = () => {
  const { locale } = useRouter();
  const content = generatePageTypeByLocale((locale || "en") as Locale).common;
  return (
    <div className="flex items-center justify-center py-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-300">404</h1>
        <p className="mt-2 text-lg text-red-300">{content.notFoundDesc}</p>
      </div>
    </div>
  );
};
