import {} from "react/jsx-runtime";
import { FaInstagramSquare } from "react-icons/fa";
import "../global.css";

function MGC() {
  return (
    <div className="container mgc-container">
      <h2>Multicultural Greek Council</h2>

      <p>Want to learn more about MGC?</p>
      <p>Check out the instagram!</p>

      <a
        href="https://www.instagram.com/utamgc/"
        target="_blank"
        rel="noopener noreferrer"
        className="mgc-link"
      >
        <FaInstagramSquare className="mgc-icon" />
      </a>
      <a
        href="https://www.uta.edu/student-affairs/fsl/our-community/multicultural-greek-council"
        target="_blank"
        rel="noopener noreferrer"
        className="mgc-link"
      >
        More!
      </a>
    </div>
  );
}

export default MGC;
