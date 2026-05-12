import {} from "react/jsx-runtime";
import IntroSec from "../components/Home/IntroSec";
import Events from "../components/EventsFolder/Events";
import About from "../components/Home/About";
import MGC from "../components/Home/mgc";
import School from "../components/Home/School";
import Follow from "../components/Home/Follow";
import Footer from "../components/Home/Footer";

function App() {
  return (
    <>
      <svg
        width="0"
        height="0"
        style={{ position: "absolute", pointerEvents: "none" }}
      >
        <defs>
          <linearGradient id="mgc-insta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#405DE6" /> {/* Blue */}
            <stop offset="25%" stopColor="#5851DB" /> {/* Purple */}
            <stop offset="50%" stopColor="#C13584" /> {/* Pink */}
            <stop offset="75%" stopColor="#E1306C" /> {/* Red/Pink */}
            <stop offset="100%" stopColor="#FCAF45" /> {/* Orange */}
          </linearGradient>
        </defs>
      </svg>
      ;
      <div className="AppGrid">
        <div className="Welcome">
          <IntroSec />
        </div>
        <div className="gap">
          <div className="chevron" />
        </div>
        <div className="Events">
          <Events />
        </div>
        <div className="About">
          <About />
        </div>
        <div className="School">
          <School />
        </div>
        <div className="MGC">
          <MGC />
        </div>
        <div className="Follow">
          <Follow />
        </div>
        <div className="Footer">
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
