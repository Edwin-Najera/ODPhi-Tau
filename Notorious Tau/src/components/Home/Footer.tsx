import { FaGithub } from "react-icons/fa";
import "../global.css";

function Footer() {
  return (
    <div className="footer-container">
      <span className="footer-right">Developed By Edwin Najera</span>
      <span className="footer-left">
        <a href="https://github.com/Edwin-Najera" target="_blank">
          <FaGithub />
        </a>
      </span>
    </div>
  );
}

export default Footer;
