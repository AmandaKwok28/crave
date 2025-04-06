import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatTimestamp(timestamp: string) {
  const formattedTimestamp =
    dayjs().diff(dayjs(timestamp), "hour") <= 48
      ? dayjs(timestamp).fromNow()
      : dayjs(timestamp).format("MMM D, YYYY");
  return formattedTimestamp;
}