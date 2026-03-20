import { useState, useEffect, useRef } from "react";

interface CountdownBlockProps {
  value: number;
  label: string;
}

function CountdownBlock({ value, label }: CountdownBlockProps) {
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
}

export default CountdownBlock;
