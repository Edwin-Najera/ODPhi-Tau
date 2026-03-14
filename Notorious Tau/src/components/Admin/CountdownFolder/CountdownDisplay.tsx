import { useState, useEffect, useRef } from "react";
import type { TimeLeft, Countdown } from "../../EventsFolder/eventData";

interface CountdownBlockProps {
  value: number;
  label: string;
}

const CountdownBlock = ({ value, label }: CountdownBlockProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [animate, setAnimate] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setAnimate(true);
      const timeout = setTimeout(() => {
        setDisplayValue(value);
        setAnimate(false);
      }, 300);
      prevValue.current = value;
      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <div className="countdown-block">
      <div className={`countdown-number-wrapper ${animate ? "flip" : ""}`}>
        <span className="countdown-number">
          {String(displayValue).padStart(2, "0")}
        </span>
      </div>
      <span className="countdown-label">{label}</span>
    </div>
  );
};

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
