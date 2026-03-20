import { Fragment } from "react/jsx-runtime";
import { useRef, useEffect } from "react";
import tau from "../Photos/Group.JPEG";
import "../global.css";

function IntroSec() {
  const textRefLeft = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1320px)");

    function handleScreenChange(event: MediaQueryList | MediaQueryListEvent) {
      const element = textRefLeft.current;
      if (!element) {
        console.error("Element not found");
        return;
      }
      if (event.matches) {
        element.innerHTML = "The Notorious Tau Omega Delta Phi Inc.";
      } else {
        element.innerHTML = "The Notorious Tau <br /> Omega Delta Phi Inc.";
      }
    }

    handleScreenChange(mediaQuery);

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  return (
    <Fragment>
      <div className="home-grid">
        <div className="left-half">
          <div className="relative-container"></div>
          <h2 className="text-left" ref={textRefLeft}></h2>
        </div>
        <div className="right-half">
          <img src={tau} alt="TAU" />
        </div>
      </div>
    </Fragment>
  );
}

export default IntroSec;
