"use client";
import React, { useState, useEffect } from "react";

export function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  function calculateTimeRemaining() {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (
    timeRemaining.days +
      timeRemaining.hours +
      timeRemaining.minutes +
      timeRemaining.hours ===
    0
  ) {
    return (
      <div>
        <p>The hunt has started!</p>
      </div>
    );
  }

  return (
    <div>
      <p>
        {timeRemaining.days} days, {timeRemaining.hours} hours,{" "}
        {timeRemaining.minutes} minutes, {timeRemaining.seconds} seconds until
        the hunt starts.
      </p>
    </div>
  );
}

export default Countdown;
