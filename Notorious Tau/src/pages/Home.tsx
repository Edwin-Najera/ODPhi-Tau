import { Fragment } from "react/jsx-runtime";
import IntroSec from "../components/Home/IntroSec";
import Events from "../components/EventsFolder/Events";
import About from "../components/Home/About";
import MGC from "../components/Home/mgc";
import School from "../components/Home/School";
import Footer from "../components/Home/Footer";

function App() {
  return (
    <Fragment>
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <defs>
          <linearGradient id="mgcInsta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#405DE6" /> {/* Blue */}
            <stop offset="25%" stopColor="#5851DB" /> {/* Purple */}
            <stop offset="50%" stopColor="#C13584" /> {/* Pink */}
            <stop offset="75%" stopColor="#E1306C" /> {/* Red/Pink */}
            <stop offset="100%" stopColor="#FCAF45" /> {/* Orange */}
          </linearGradient>
        </defs>
      </svg>
      ;
      <div id="AppGrid">
        <div id="Welcome">
          <IntroSec />
        </div>
        <div id="gap">
          <div className="chevron" />
        </div>
        <div id="Events">
          <Events />
        </div>
        <div id="About">
          <About />
        </div>
        <div id="School">
          <School />
        </div>
        <div id="MGC">
          <MGC />
        </div>
        <div id="Contact"></div>
        <div id="Footer">
          <Footer />
        </div>
      </div>
    </Fragment>
  );
}

export default App;
