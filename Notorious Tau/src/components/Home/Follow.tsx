import { Fragment } from "react/jsx-runtime";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import letters from "../Photos/ODP Minimal Letters - White.png";

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
            </div>
          </div>
          <div className="extension">
            <div className="footer-contact">
              <h6>Get in Touch</h6>
              <ul className="touch-list">
                <li className="list-item">
                  <a href="mailto:president.tau@omegadeltaphi.org">
                    president.tau@omegadeltaphi.org
                  </a>
                </li>
                <li className="list-item">
                  <a href="mailto:vp.tau@omegadeltaphi.org">
                    vp.tau@omegadeltaphi.org
                  </a>
                </li>
                <li className="list-item">
                  <a href="mailto:recruitment.tau@omegadeltaphi.org">
                    recruitment.tau@omegadeltaphi.org
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-contact">
              <h6>Active House</h6>
              <ul className="touch-list">
                <li>
                  <Link to="/Mtb" className="list-item">
                    Actives & Executives
                  </Link>
                </li>
              </ul>
            </div>
            <div className="footer-contact">
              <h6>Service Events</h6>
              <ul className="touch-list">
                <li>
                  <Link to="/Service" className="list-item">
                    Service
                  </Link>
                </li>
              </ul>
            </div>
            <h3 className="founding-date">Est. 1987</h3>
            <img src={letters} alt="letters" className="letters" />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default Follow;
