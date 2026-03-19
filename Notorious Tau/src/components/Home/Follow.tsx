import { Fragment } from "react/jsx-runtime";
import { useInView } from "react-intersection-observer";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

function Follow() {
  const { ref: followRef, inView: visibleElement } = useInView({
    triggerOnce: true,
  });
  return (
    <Fragment>
      <div className="follow-container">
        <div
          ref={followRef}
          className={`follow-wrapper ${visibleElement ? "active-follow" : ""}`}
        >
          <h2>Contact Us</h2>
          <div className="line-separate" />
          <div className="info-wrapper">
            <div className="founding-date-loc">
              <div className="follow-dates">
                <span className="year">1987</span>
                <span className="spacer" />
                <span className="school-loc">Texas Tech University</span>
                <span className="spacer" />
                <span className="loc">Lubbock, Texas</span>
              </div>
              <div className="follow-dates">
                <span className="year">1997</span>
                <span className="spacer" />
                <span className="school-loc">
                  University of Texas, Arlington
                </span>
                <span className="spacer" />
                <span className="loc">Arlington, Texas</span>
              </div>
            </div>
            <div className="icons-wrapper">
              <a
                href="https://www.instagram.com/tau_knights/"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram className="follow-icon" />
              </a>
              <a target="_blank" rel="noreferrer">
                <FaTiktok className="follow-icon" />
              </a>
              <a target="_blank" rel="noreferrer">
                <MdOutlineMail className="follow-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Follow;
