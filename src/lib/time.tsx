"use client";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
  timeStyle: "medium",
});

export function FormattedTime({ time }: { time: string | Date | null }) {
  if (!time) {
    return <></>;
  }
  if (typeof time === "string") {
    time = new Date(time);
  }
  return <>{dateTimeFormatter.format(time)}</>;
}
