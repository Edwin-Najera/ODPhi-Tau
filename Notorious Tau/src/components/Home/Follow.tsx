import { Fragment } from "react/jsx-runtime";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import rush from "../Photos/Rush ODPhi 2022 Fall shirt Design_Final_For Red Outlines.png";

function Follow() {
  const { ref: follow, inView: visibleElement } = useInView({
    triggerOnce: true,
  });

  return (
    <Fragment>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <clipPath id="clip-hilt" clipPathUnits="objectBoundingBox">
            <path d="M 1 0 L 1 1 L 0 1  Q 1 0.75 0 0.5 Q 1 0.25 0 0 Z" />
          </clipPath>
          <clipPath id="clip-handle" clipPathUnits="objectBoundingBox">
            <path d="M -0.1 0.5 L -0.25 0.1 Q 0.35 0.1 0.8 0.4 L 0.8 0.6 Q 0.35 0.9 -0.25 0.9 Z" />
            <ellipse cx="0.8" cy="0.5" rx="0.05" ry="0.17" />
          </clipPath>
        </defs>
      </svg>
      <div
        ref={follow}
        className={`follow-container ${visibleElement ? "active-sword" : ""} `}
      >
        <img
          ref={follow}
          className={`rush-image follow-rush ${visibleElement ? "rush-effect" : ""}`}
          src={rush}
        />
        <div className="follow-wrapper">
          <h2 className="follow-header">Follow Us</h2>
          <div className="follow-sword"></div>
          <div className="follow-hilt">
            <div className="hilt-start" />
            <div className="hilt" />
            <div className="hilt-end" />
            <div className="follow-handle" />
          </div>
          <div className="icons-wrapper">
            <FaInstagram className="follow-icon" />
            <FaTiktok className="follow-icon" />
          </div>
        </div>
        <img
          ref={follow}
          className={`rush-image follow-rush ${visibleElement ? "rush-effect" : ""}`}
          src={rush}
        />
      </div>
    </Fragment>
  );
}

export default Follow;
