import { useState, useEffect, useRef } from "react";
import type { TimeLeft, Countdown } from "../../EventsFolder/eventData";
import CountdownBlock from "./CountdownBlock";

function CountdownDisplay({ countdown }: { countdown: Countdown }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(countdown.targetDate).getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [countdown.targetDate]);

  return (
    <div className="countdown-container">
      <div className="countdown-timer">
        <CountdownBlock value={timeLeft.days} label="Days" />
        <span className="countdown-separator">:</span>
        <CountdownBlock value={timeLeft.hours} label="Hours" />
        <span className="countdown-separator">:</span>
        <CountdownBlock value={timeLeft.minutes} label="Minutes" />
        <span className="countdown-separator">:</span>
        <CountdownBlock value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
}

export default CountdownDisplay;
