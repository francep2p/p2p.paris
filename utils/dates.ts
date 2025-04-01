import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatTime = (isoString: string) => {
  return dayjs(isoString).tz("Europe/Berlin").format("HH[H]mm");
};

export const formatDate = (isoString: string) => {
  return dayjs(isoString).tz("Europe/Berlin").format("MMMM D, YYYY");
};

const replaceSecondOccurrence = (
  str: string,
  query: string,
  replaceBy: string,
) => {
  const parts = str.split(query);
  if (parts.length > 2) {
    parts[1] += replaceBy + parts.splice(2).join(query);
  }
  return parts.join(query);
};

export const formatEventFullDate = (
  startDateTime: string,
  endDateTime: string,
) => {
  const startMonth = dayjs(startDateTime).tz("Europe/Berlin").format("MMMM");
  const formattedStartDate = dayjs(startDateTime)
    .tz("Europe/Berlin")
    .format("MMMM Do");
  const formattedEndDate = dayjs(endDateTime)
    .tz("Europe/Berlin")
    .format("MMMM Do, YYYY");
  return replaceSecondOccurrence(
    `${formattedStartDate} to ${formattedEndDate}`,
    startMonth,
    "",
  );
};
