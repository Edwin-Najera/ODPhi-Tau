import { useEffect, useState } from "react";
import tau from "../Photos/Tau1.jpeg";
import "../global.css";

function IntroSec() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 992px)");

    const handleScreenChange = (e: MediaQueryList | MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    handleScreenChange(mediaQuery);
    mediaQuery.addEventListener("change", handleScreenChange);
    return () => mediaQuery.removeEventListener("change", handleScreenChange);
  }, []);

  return (
    <div className="intro">
      <h2 className="text-left">
        {isMobile ? (
          "The Notorious Tau of Omega Delta Phi Inc."
        ) : (
          <>
            The Notorious Tau <br /> of Omega Delta Phi Inc.
          </>
        )}
      </h2>
      <img src={tau} alt="TAU" />
    </div>
  );
}

export default IntroSec;
