import { Fragment } from "react/jsx-runtime";
import { FaInstagramSquare } from "react-icons/fa";
import "../global.css";

function MGC() {
  return (
    <Fragment>
      <div className="container" id="mgc-container">
        <h2>Multicultural Greek Council</h2>
        <p>
          Want to learn more about MGC?
          <br /> Check out the instagram!
        </p>
        <a
          href="https://www.instagram.com/utamgc/"
          target="_blank"
          className="mgc-link"
        >
          <FaInstagramSquare
            className="mgc-icon"
            style={{ fill: "url(#mgcInsta)" }}
          />
        </a>
        <a
          href="https://www.uta.edu/student-affairs/fsl/our-community/multicultural-greek-council"
          target="_blank"
          className="mgc-link"
        >
          More!
        </a>
      </div>
    </Fragment>
  );
}

export default MGC;
