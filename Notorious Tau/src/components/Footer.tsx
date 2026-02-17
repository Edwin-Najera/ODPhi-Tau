import { Fragment } from "react/jsx-runtime";
import "./global.css";

function Footer() {
  return (
    <Fragment>
      <div className="footerContainer">
        <div id="footerRight">Developed By Edwin Najera</div>
        <div id="footerLeft">Some words</div>
      </div>
    </Fragment>
  );
}

export default Footer;
